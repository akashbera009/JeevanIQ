from rest_framework.views import APIView
from .serializers import UserSerializer

from .models import User
from rest_framework.authtoken.models import Token

from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate


class RegisterUser(APIView):
    def post(self ,request):
        serialiser = UserSerializer(data = request.data)
        print(serialiser)
        if not serialiser.is_valid():
            return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serialiser.save() # save user to table 
        user  = User.objects.get(username = serialiser.data["username"])# get user 
        token_obj , _  = Token.objects.get_or_create(user=user)
        print(token_obj)

        return Response({
            "status": 200,
            "payload": serialiser.data,
            "token": str(token_obj),
            "message": "user registered successfully"
        }, status=status.HTTP_201_CREATED)


class LoginUser(APIView):
    def post(self ,request):
        username = request.data.get("username")
        password = request.data.get("password")
        print(username , password)
        if not username or not password:
            return Response({
                "message": "Username and password are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        # user = authenticate(username=username, password=password) # works if password has been hashed 
        user  = User.objects.get(username = username)

        # delete existing token and generate new one on each login [ my security ] 
        Token.objects.filter(user = user ).delete()
        token_obj = Token.objects.create(user=user)

        print('user is ' , user)
        if user is None:
            return Response({
                "message": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

        token_obj, _ = Token.objects.get_or_create(user=user)

        return Response({
            "status": 200,
            "username": user.username,
            "token": str(token_obj),
            "message": "Login successful"
        }, status=status.HTTP_200_OK)