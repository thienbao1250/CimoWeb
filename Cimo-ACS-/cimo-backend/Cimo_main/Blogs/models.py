import uuid
from django.db import models

class SoBlog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    description = models.TextField()
    slug = models.SlugField(unique=True)
    count_view = models.IntegerField(default=0)
    image = models.ImageField(upload_to="blog_images/", null=True, blank=True)
    relation_id = models.UUIDField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
