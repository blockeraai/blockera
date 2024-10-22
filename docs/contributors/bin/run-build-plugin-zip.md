## Run Build Plugin Zip Command

### Regenerating Bash Script

`php ./bin/generate-build-plugin-zip-sh.php > ./bin/build-plugin-zip.temp.sh`

### Change the access permissions and the special mode flags

`chmod +x ./bin/build-plugin-zip.temp.sh`

### Execute Created Temporary Bash Script

<code>
export NO_CHECKS='true' &&
export NO_INSTALL_NPM='true' &&
./bin/build-plugin-zip.temp.sh
</code>

### Delete Permanently Temporary File

`rm -rf ./bin/build-plugin-zip.temp.sh`