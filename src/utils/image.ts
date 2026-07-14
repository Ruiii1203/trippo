const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function readImageFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('请选择图片文件'))
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('图片较大，可能占用较多本地空间'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = () => {
      reject(new Error('图片读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

export function isLargeImage(file: File): boolean {
  return file.size > MAX_IMAGE_SIZE
}
