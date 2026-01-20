import { google } from 'googleapis';
import { readFile, createReadStream } from 'fs';
import { writeFile as writeFileSync } from 'fs';
import { promisify } from 'util';
import path from 'path';

const writeFile = promisify(writeFileSync);

// Google服务账户密钥文件路径 from environment variable
const KEY_FILE_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

if (!KEY_FILE_PATH) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_FILE environment variable is required');
}

// 创建认证
async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return auth;
}

// 获取 Drive 实例
async function getDrive() {
  const auth = await getAuth();
  return google.drive({ version: 'v3', auth });
}

// 上传文件到 Google Drive 并转换
async function uploadAndConvert(inputPath: string, targetFormat: string): Promise<Buffer> {
  const drive = await getDrive();

  const fileName = path.basename(inputPath);

  // 上传文件到 Drive（指定转换为 Google Docs）
  const uploadResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'application/vnd.google-apps.document', // 转换为 Google Docs
    },
    media: {
      mimeType: 'text/html', // 假设输入是 HTML
      body: createReadStream(inputPath), // 使用流
    },
  });

  const fileId = uploadResponse.data.id;
  if (!fileId) {
    throw new Error('Failed to upload file to Drive');
  }

  // 等待转换完成
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 导出为目标格式
  const mimeTypes: { [key: string]: string } = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
  };

  const targetMimeType = mimeTypes[targetFormat.toLowerCase()];
  if (!targetMimeType) {
    throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  const exportResponse = await drive.files.export({
    fileId,
    mimeType: targetMimeType,
  });

  const exportBuffer = exportResponse.data as Buffer;

  // 清理：删除 Drive 中的文件
  await drive.files.delete({ fileId });

  return exportBuffer;
}

// 主转换函数
export async function convertDocumentWithGoogle(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const exportBuffer = await uploadAndConvert(inputPath, targetFormat);
    await writeFile(outputPath, exportBuffer);
    return { success: true };
  } catch (error) {
    console.error('Google Drive conversion error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Google Drive conversion failed' };
  }
}