export const formEmail = (formData) => {
    return `<!DOCTYPE html>
<html lang="vi">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông tin từ Form Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
        }
        .info {
            background-color: #f9f9f9;
            border: 1px solid #dddddd;
            padding: 15px;
            margin-bottom: 20px;
        }
        .info p {
            margin: 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #333333;
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Thông tin khách hàng</h2>
        <div class="info">
            <p><strong>Tên khách hàng:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
            <p><strong>Nội dung yêu cầu:</strong> <br>${formData.topic}</p>
        </div>  
    </div>
    <div class="footer">
        <p>&copy; 2024 BLATTSTUDIOS . All rights reserved.</p>
    </div>
</body>
</html>`;
};
