from django.test import TestCase
from .models import SoBlog

class SoBlogModelTest(TestCase):

    def setUp(self):
        self.blog = SoBlog.objects.create(
            title='Test Blog',
            summary='This is a test summary.',
            description='This is a test description.',
            slug='test-blog',
            count_view=0,
            is_deleted=False
        )

    def test_blog_creation(self):
        self.assertEqual(self.blog.title, 'Test Blog')
        self.assertEqual(self.blog.summary, 'This is a test summary.')
        self.assertEqual(self.blog.description, 'This is a test description.')
        self.assertEqual(self.blog.slug, 'test-blog')
        self.assertEqual(self.blog.count_view, 0)
        self.assertFalse(self.blog.is_deleted)

    def test_blog_str(self):
        self.assertEqual(str(self.blog), 'Test Blog')