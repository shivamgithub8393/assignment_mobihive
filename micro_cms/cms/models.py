from django.db import models
from django.contrib.sites.models import Site
from django.contrib.auth.models import User
from django.core.mail import send_mail

# Create your models here.
class WebPage(models.Model):
    site = models.OneToOneField(Site, on_delete=models.CASCADE)
    page_title = models.CharField(max_length=255)
    allowed_devices = models.ForeignKey('Device', on_delete=models.CASCADE)

    def __str__(self):
        return self.page_title

class PageSection(models.Model):
    section_title = models.CharField(max_length=255)
    section_image = models.ImageField(upload_to='sections/')
    section_html_content = models.TextField()
    section_order = models.IntegerField()
    page = models.ForeignKey(WebPage, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.section_title

class Country(models.Model):
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    managed_by_user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Device(models.Model):
    name = models.CharField(max_length=255)
    device_photo = models.ImageField(upload_to='devices/')
    currency = models.CharField(max_length=10)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    sourced = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Lead(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    referral_code = models.CharField(max_length=20, blank=True, null=True)
    lead_status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('In-progress', 'In-progress'),
        ('Converted', 'Converted'),
        ('Rejected', 'Rejected'),
    ], default='Pending')

    def __str__(self):
        return self.name

class WalkIn(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    currency = models.CharField(max_length=10)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    walk_in_date_time = models.DateTimeField(auto_now_add=True)
    token_number = models.IntegerField(unique=True)

    # Generate token_number by incrementing 1
    def save(self, *args, **kwargs):
        if not self.token_number:
            last_token = WalkIn.objects.all().order_by('token_number').last()
            self.token_number = last_token.token_number + 1 if last_token else 1
        super().save(*args, **kwargs)
        ## send email after adding data
        self.send_emails()
        
    def send_emails(self):
        # Send email to the visitor
        subject = "Walk-in Token"
        message = f"Hello {self.lead.name}, your walk-in token number is: {self.token_number}"
        send_mail(subject, message, 'admin@gmail.com', [self.lead.email])

        # Send email to the assigned Vendor
        vendor_subject = "New Walk-in"
        vendor_message = f"A new walk-in has been recorded for {self.lead.name} with token: {self.token_number}"
        send_mail(vendor_subject, vendor_message, 'admin@gmail.com', [self.vendor.managed_by_user.email])

    def __str__(self):
        return self.lead.name