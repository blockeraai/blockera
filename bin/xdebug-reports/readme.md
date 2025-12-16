### 1️⃣ Create the command file

mkdir -p ~/bin
nano ~/bin/xdebug-reports

### 2️⃣ Paste this FULL script (parameterized BASE_DIR)

Copy the xdebug-reports file to editor and save it.

### 3️⃣ Make it executable

chmod +x ~/bin/xdebug-reports

### 4️⃣ Ensure ~/bin is in PATH

Add once to ~/.zshrc:
export PATH="$HOME/bin:$PATH"

Reload:
source ~/.zshrc

### 5️⃣ Use it

Use current directory:
cd /Users/aliaghdam/Sites/xdebug-profiles
xdebug-reports

Or pass a directory:
xdebug-reports /Users/aliaghdam/Sites/xdebug-profiles
