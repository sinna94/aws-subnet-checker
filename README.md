# aws-subnet-checker

입력한 CIDR 중 aws subnet 에서 사용가능 여부를 반환합니다.

## build

### node

```shell
npm run build
```

### executable

```shell
npm run package

-- windows
npm run package-win

-- macos
npm run package-mac

-- linux
npm run package-linux
```

## run

#### AWS 자격증명
* Linux, Unix 및 macOS의 공유 자격 증명 파일: ~/.aws/credentials
* Windows의 공유 자격 증명 파일: C:\Users\USER_NAME\.aws\credentials

위의 파일을 생성하여 아래와 같이 내용을 넣습니다.

```properties
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```
#### Arguments

| argument    | required | description                                   |
|-------------|----------|-----------------------------------------------|
| cidr-blocks | O        | 확인할 CIDR 블록들 예) 172.31.34.0/24,172.31.35.0/24 |
| region      | O        | AWS Region 예) ap-northeast-2                  |
| vpi-id      | X        | 필터링할 VPC ID, 입력시 해당 VPC 에 해당하는 CIDR 결과만 반환    |

### node

```shell
node ./dist/main.js --cidr-blocks ${cidr_blocks} --region ${region}
```

### executable

```shell
./aws-subnet-checker --cidr-blocks ${cidr_blocks} --region ${region}
```

