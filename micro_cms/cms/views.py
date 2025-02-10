from django.shortcuts import render

from rest_framework import viewsets, status
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class DeviceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
class LeadCaptureView(APIView):
    def post(self, request):
        # Save lead data
        lead_serializer = LeadSerializer(data=request.data)
        if lead_serializer.is_valid():
            lead = lead_serializer.save()
            # for testing 
            vendor = Vendor.objects.first()
            device = Device.objects.first()

            walk_in_data = {
                'lead': lead.id,
                'vendor': vendor.id,
                'device': device.id,
                'currency': 'INR',  
                'offer_price': device.offer_price,
            }
            walk_in_serializer = WalkInSerializer(data=walk_in_data)
            if walk_in_serializer.is_valid():
                walk_in = walk_in_serializer.save()
                return Response({
                    'token_number': walk_in.token_number,
                    'message': 'Walk-in record created successfully.'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(walk_in_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(lead_serializer.errors, status=status.HTTP_400_BAD_REQUEST)