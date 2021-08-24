from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in rasiin/__init__.py
from rasiin import __version__ as version

setup(
	name="rasiin",
	version=version,
	description="Custom app for rasiin healthcare",
	author="rasiin",
	author_email="rasiin@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
