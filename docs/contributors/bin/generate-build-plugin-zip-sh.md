## Generating "build-plugin-zip.sh" bash file  

### Regenerating bash script

Enter below command into terminal:

 ```shell
php generate-build-plugin-zip-sh.php > ./bin/build-plugin-zip.temp.sh
 ```

### Change file mode

We should not commit new file created ``build-plugin-zip.temp.sh``, 
in this step we should run below command to change directory mode of created file.

```shell
chmod +x ./bin/build-plugin-zip.temp.sh
```

### Execute bash script

We should execute bash script to generate plugin zip file.

```shell
./bin/build-plugin-zip.temp.sh
```

### Done

We should not commit file on git, so delete permanently it.

```shell
rm -rf ./bin/build-plugin-zip.temp.sh
```