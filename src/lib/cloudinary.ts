import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File | string, folder: string = 'med-construction') {
    try {
        if (!file) throw new Error('No file provided');

        if (typeof file === 'string') {
            const result = await cloudinary.uploader.upload(file, {
                folder,
                resource_type: 'image',
            });
            return { success: true, url: result.secure_url, publicId: result.public_id };
        }

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder,
            resource_type: 'image',
        });

        return { success: true, url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return { success: false, error };
    }
}

export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { success: true, result };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return { success: false, error };
    }
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number) {
    if (!url) return '';
    
    const baseUrl = url.split('upload/')[0] + 'upload/';
    const transformations = ['f_auto', 'q_auto'];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push('c_fill');
    
    const afterUpload = url.split('upload/')[1] || '';
    return `${baseUrl}${transformations.join(',')}/${afterUpload}`;
}

export default cloudinary;
