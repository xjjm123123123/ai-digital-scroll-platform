import os
from PIL import Image

# Disable decompression bomb protection for large images
Image.MAX_IMAGE_PIXELS = None

def slice_image(image_path, output_dir, num_slices=10):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    img = Image.open(image_path)
    width, height = img.size
    slice_width = width // num_slices
    
    print(f"Image size: {width}x{height}")
    print(f"Slicing into {num_slices} parts, approx width: {slice_width}")
    
    for i in range(num_slices):
        left = i * slice_width
        # For the last slice, take the rest of the image
        right = (i + 1) * slice_width if i < num_slices - 1 else width
        
        box = (left, 0, right, height)
        slice_img = img.crop(box)
        
        output_path = os.path.join(output_dir, f"tile_{i}.jpg")
        slice_img.save(output_path, quality=90)
        print(f"Saved {output_path} ({right-left}x{height})")

if __name__ == "__main__":
    image_path = "public/images/binfengtu_small.jpg"
    output_dir = "public/images/tiles"
    slice_image(image_path, output_dir)