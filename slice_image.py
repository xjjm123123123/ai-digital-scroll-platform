import os
from PIL import Image

# 禁用大图像的解压炸弹保护，避免PIL在处理超大图像时报错
Image.MAX_IMAGE_PIXELS = None

def slice_image(image_path, output_dir, num_slices=10):
    """
    将高分辨率图像切割为多个切片，并生成缩略图
    
    参数:
        image_path: 输入图像的路径
        output_dir: 输出目录，切片和缩略图将保存在此目录
        num_slices: 切片数量，默认为10
    """
    # 创建输出目录（如果不存在）
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # 打开图像并获取尺寸
    img = Image.open(image_path)
    width, height = img.size
    # 计算每个切片的宽度
    slice_width = width // num_slices
    
    print(f"Image size: {width}x{height}")
    print(f"Slicing into {num_slices} parts, approx width: {slice_width}")
    
    # 循环切割图像
    for i in range(num_slices):
        # 计算当前切片的左边界
        left = i * slice_width
        # 对于最后一个切片，右侧边界取图像总宽度（确保包含剩余像素）
        right = (i + 1) * slice_width if i < num_slices - 1 else width
        
        # 定义裁剪区域：(左, 上, 右, 下)
        box = (left, 0, right, height)
        # 裁剪切片
        slice_img = img.crop(box)
        
        # 保存切片文件
        output_path = os.path.join(output_dir, f"tile_{i}.jpg")
        slice_img.save(output_path, quality=90)
        print(f"Saved {output_path} ({right-left}x{height})")

    # 生成首页缩略图
    thumbnail_width = 2048
    # 保持原始宽高比
    aspect_ratio = height / width
    thumbnail_height = int(thumbnail_width * aspect_ratio)
    
    # 使用LANCZOS重采样方式调整图像大小（高质量）
    thumbnail = img.resize((thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)
    thumbnail_path = os.path.join(output_dir, "thumbnail.jpg")
    thumbnail.save(thumbnail_path, quality=85)
    print(f"Saved thumbnail {thumbnail_path} ({thumbnail_width}x{thumbnail_height})")

if __name__ == "__main__":
    # 默认配置：输入图像和输出目录
    image_path = "public/images/binfengtu_small.jpg"
    output_dir = "public/images/tiles"
    slice_image(image_path, output_dir)
