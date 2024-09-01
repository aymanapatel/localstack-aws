#!/usr/bin/env/python
import boto3
import logging
from botocore.exceptions import ClientError
from botocore.client import Config

config = Config(
   signature_version = 's3v4'
)

upload_file_name = 'long.txt'
download_file_name = 'downloadlong.txt'
bucket_name = 'ayman-bucket'

s3Resource = boto3.resource('s3',
                    endpoint_url='http://s3.localhost.localstack.cloud:4566',
                    aws_access_key_id='test',
                    aws_secret_access_key='test',
                    config=config)

s3Client = boto3.client('s3',
                    endpoint_url='http://s3.localhost.localstack.cloud:4566',
                    aws_access_key_id='test',
                    aws_secret_access_key='test')                    

# s3Resource.create_bucket(Bucket='newbucket')
  # upload a file from local file system 'myfile' to bucket 'mybucket' with 'my_uploaded_object' as the object name.
s3Resource.Bucket(bucket_name).upload_file(upload_file_name,upload_file_name)

s3Resource.Bucket(bucket_name).download_file(upload_file_name, download_file_name)
resp = s3Client.get_object(Bucket=bucket_name, Key=upload_file_name, Range='bytes={}-{}'.format(0, 100))
content = resp['Body'].read()


print('S3 Byte range answer')
print(content)

