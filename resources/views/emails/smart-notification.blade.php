<!DOCTYPE html>
<html>
<head>
    <title>{{ $emailSubject }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="padding: 20px;">
        {!! nl2br(e($emailBody)) !!}
    </div>
</body>
</html>
