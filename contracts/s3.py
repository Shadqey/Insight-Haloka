import boto3

from halokaproj.settings import AWS
from halokaproj.settings import FILE_UPLOAD_BASE_URL, IMAGE_UPLOAD_BASE_URL

class S3Client:
    client: any
    report_bucket: str

    def __init__(self):
        self.client = boto3.client(
            's3',
            aws_access_key_id=AWS['S3']['ACCESS_KEY_ID'],
            aws_secret_access_key=AWS['S3']['SECRET_ACCESS_KEY'],
        )
        self.bucket = AWS['S3']['BUCKET']
        self.url = AWS['S3']['URL']

    def put_agreement(self, pdf_file: any, key: str) -> str:
        """
        Expected key format:
        <class name>/<certificate uuid>/<participant name>.pdf
        """
        bucket_path = f'{FILE_UPLOAD_BASE_URL}/agreement/{key}'
        self.client.put_object(
            Body=pdf_file,
            Bucket=self.bucket,
            Key=bucket_path,
            ACL='public-read',
            ContentType='binary/octet-stream',
        )
        download_file_url = self.construct_download_url(bucket_path)
        return download_file_url

    def construct_download_url(self, bucket_path: str) -> str:
        base_s3_url = self.url.replace(f'{self.bucket}.', '')
        return f'{base_s3_url}/{self.bucket}/{bucket_path}'
    
s3_client = S3Client()