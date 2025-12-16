### 1️⃣ Create the command file

mkdir -p ~/bin
nano ~/bin/xdebug-graphs

### 2️⃣ Paste this FULL script (parameterized BASE_DIR)

Copy the xdebug-graph file to editor and save it.

### 3️⃣ Make it executable

chmod +x ~/bin/xdebug-graphs

### 4️⃣ Ensure ~/bin is in PATH

Add once to ~/.zshrc:
export PATH="$HOME/bin:$PATH"

Reload:
source ~/.zshrc

### 5️⃣ Use it

Use current directory:
cd /Users/aliaghdam/Sites/xdebug-profiles
xdebug-graphs

Or pass a directory:
xdebug-graphs /Users/aliaghdam/Sites/xdebug-profiles
