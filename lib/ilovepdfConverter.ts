import jwt from 'jsonwebtoken';
import { readFile, writeFile } from 'fs/promises';

// ILovePDF API 密钥 from environment variables
const PUBLIC_KEY = process.env.ILOVEPDF_PUBLIC_KEY;
const SECRET_KEY = process.env.ILOVEPDF_SECRET_KEY;

if (!PUBLIC_KEY || !SECRET_KEY) {
  throw new Error('ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY environment variables are required');
}

// 获取 JWT token（从服务器请求）
async function getToken(): Promise<string> {
  const response = await fetch('https://api.ilovepdf.com/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_key: PUBLIC_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

// 获取授权头
async function getAuthHeaders() {
  const token = await getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// 转换文档
export async function convertDocumentWithILovePDF(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 确定工具：officepdf 用于 Office 文档，htmlpdf 用于 HTML
    const fileExtension = inputPath.split('.').pop()?.toLowerCase();
    let tool = 'officepdf'; // 默认

    if (fileExtension === 'html' || fileExtension === 'htm') {
      tool = 'htmlpdf';
    }

    // 1. Start task
    const startResponse = await fetch(`https://api.ilovepdf.com/v1/start/${tool}/eu`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!startResponse.ok) {
      throw new Error(`Start failed: ${startResponse.statusText}`);
    }

    const startData = await startResponse.json();
    const { server, task } = startData;

    // 2. Upload file
    const fileBuffer = await readFile(inputPath);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), `input.${fileExtension}`);

    const uploadResponse = await fetch(`https://${server}/v1/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getToken()}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    const serverFilename = uploadData.server_filename;

    // 3. Process file
    const processResponse = await fetch(`https://${server}/v1/process`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        task,
        tool,
        files: [{
          server_filename: serverFilename,
          filename: `input.${fileExtension}`,
        }],
      }),
    });

    if (!processResponse.ok) {
      throw new Error(`Process failed: ${processResponse.statusText}`);
    }

    const processData = await processResponse.json();

    if (processData.status !== 'TaskSuccess') {
      throw new Error(`Processing failed: ${processData.status}`);
    }

    // 4. Download result
    const downloadResponse = await fetch(`https://${server}/v1/download/${task}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!downloadResponse.ok) {
      throw new Error(`Download failed: ${downloadResponse.statusText}`);
    }

    const outputBuffer = await downloadResponse.arrayBuffer();
    await writeFile(outputPath, Buffer.from(outputBuffer));

    return { success: true };
  } catch (error) {
    console.error('ILovePDF conversion error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'ILovePDF conversion failed' };
  }
}