from django.db import migrations


def load_fixtures(apps, schema_editor):
    from django.core.management import call_command
    call_command("loaddata", "accounts/fixtures/prefectures.json")
    call_command("loaddata", "accounts/fixtures/users.json")


class Migration(migrations.Migration):
    dependencies = [("accounts", "0001_initial")]
    operations = [migrations.RunPython(load_fixtures, migrations.RunPython.noop)]
