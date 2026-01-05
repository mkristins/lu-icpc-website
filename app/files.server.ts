import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToStorage(buffer : Buffer, fileType : string){
    const client = new S3Client({
        region: "auto",
        endpoint: process.env.S3_URL!,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!
        }
    })
    await client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: "example/test-uploads/image.png",
            Body: buffer,
            ContentType: fileType
        })
    )
}

export async function uploadAlbumImage(file : File){
    const client = new S3Client({
        region: "auto",
        endpoint: process.env.S3_URL!,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!
        }
    })

    const id = crypto.randomUUID();
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const imgUrl = `example/img/${id}/${file.name}`
    await client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: imgUrl,
            Body: body,
            ContentType: "image/png",        // or image/jpeg, image/webp, etc.
            ContentDisposition: "inline"
        })
    )
    return imgUrl
}

export async function uploadPDF(file : File) {
    const client = new S3Client({
        region: "auto",
        endpoint: process.env.S3_URL!,
        logger: console,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!
        }
    })

    const id = crypto.randomUUID();
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const pdfUrl = `example/pdf/${id}/${file.name}`
    await client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: pdfUrl,
            Body: body,
            ContentType: "application/pdf"
        })
    )
    return pdfUrl
}