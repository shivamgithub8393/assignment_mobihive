from rest_framework import serializers
from .models import WebPage, PageSection, Country, City, Vendor, Device, Lead, WalkIn

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        
class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['name', 'phone_number', 'email', 'address', 'city', 'country', 'referral_code']

class WalkInSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalkIn
        fields = ['lead', 'vendor', 'device', 'currency', 'offer_price']