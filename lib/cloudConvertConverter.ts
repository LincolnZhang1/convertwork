import CloudConvert from 'cloudconvert';
import fs from 'fs';

// CloudConvert API Key from environment variable
const API_KEY = process.env.CLOUDCONVERT_API_KEY

if (!API_KEY) {
  throw new Error('CLOUDCONVERT_API_KEY environment variable is required')
}

// 创建 CloudConvert 实例
function getCloudConvert() {
  return new CloudConvert(API_KEY!);
}

// 转换文档
export async function convertDocumentWithCloudConvert(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cloudConvert = getCloudConvert();

    // 确定输入格式
    const inputFormat = inputPath.split('.').pop()?.toLowerCase() || 'html';

    // 创建转换任务
    let job = await cloudConvert.jobs.create({
      tasks: {
        'import-my-file': {
          operation: 'import/upload',
        },
        'convert-my-file': {
          operation: 'convert',
          input: 'import-my-file',
          input_format: inputFormat,
          output_format: targetFormat,
        },
        'export-my-file': {
          operation: 'export/url',
          input: 'convert-my-file',
        },
      },
    });

    // 上传文件
    const uploadTask = job.tasks.find(task => task.name === 'import-my-file');
    if (!uploadTask) {
      throw new Error('Upload task not found');
    }

    await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(inputPath), 'input');

    // 等待转换完成
    job = await cloudConvert.jobs.wait(job.id);

    // 检查任务状态
    const convertTask = job.tasks.find(task => task.name === 'convert-my-file');
    if (!convertTask || convertTask.status !== 'finished') {
      throw new Error(`Conversion failed: ${convertTask?.message || 'Unknown error'}`);
    }

    // 下载结果
    const exportTask = job.tasks.find(task => task.name === 'export-my-file');
    if (!exportTask || !exportTask.result?.files?.[0]?.url) {
      throw new Error('Export task failed');
    }

    const fileUrl = exportTask.result.files[0].url;
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();

    // 保存到输出路径
    await fs.promises.writeFile(outputPath, Buffer.from(buffer));

    return { success: true };
  } catch (error) {
    console.error('CloudConvert conversion error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'CloudConvert conversion failed' };
  }
}