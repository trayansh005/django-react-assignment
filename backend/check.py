from django.contrib.auth import get_user_model

User = get_user_model()
print(User)
# Assuming user object is retrieved from the database
user = User.objects.get(email="trayansh2@gmail.com")
password = "trayansh"

# This will return True if the password is correct
is_password_correct = user.check_password(password)

print(user.password)
print(is_password_correct)
