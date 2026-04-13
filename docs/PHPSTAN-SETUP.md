# PHPStan Setup for Undefined Function Detection

## Important Note

**PHPCS does NOT detect undefined functions** - it only checks coding standards (formatting, naming, documentation).

**PHPStan DOES detect undefined functions** - it's a static analysis tool.

## The Problem

The PHPStan VS Code extension (`swordev.phpstan`) may not show errors automatically in the Problems panel. However, we can use VS Code Tasks to run PHPStan and display errors.

## Solutions

### Option 1: Use VS Code Task (RECOMMENDED - Shows Errors in Problems Panel)

This is the best way to see PHPStan errors in the editor:

1. **For Current File:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Tasks: Run Task`
   - Select: `Analyze PHP with PHPStan`
   - Errors will appear in the **Problems panel** (`Ctrl+Shift+M` / `Cmd+Shift+M`)

2. **For All Files:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Tasks: Run Task`
   - Select: `Analyze All PHP with PHPStan`
   - All errors will appear in the Problems panel

**Keyboard Shortcut:** You can also press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac) to run the default build task, but you'll need to set one of the PHPStan tasks as default.

### Option 2: Run PHPStan Extension Command

1. **Via Command Palette:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `PHPStan: Analyse`
   - Check the Output panel and Problems panel

### Option 3: Auto-Analysis on Save

The extension is configured to analyze on save. After saving a file:
- Check the Problems panel (`Ctrl+Shift+M` / `Cmd+Shift+M`)
- Check the Output panel → PHPStan

### Option 4: Use Terminal (For Quick Check)

```bash
vendor/bin/phpstan analyse packages/blockera/php/Providers/AppServiceProvider.php
```

Or for all files:
```bash
composer run phpstan
```

### Option 5: Check PHPStan Output Panel

1. Go to View → Output (`Ctrl+Shift+U` / `Cmd+Shift+U`)
2. Select "PHPStan" from the dropdown
3. Look for error messages

## Current Configuration

- **PHPStan Level:** 5 (configured in `phpstan.neon`)
- **Analysis Paths:** `packages/` directory
- **On Save Analysis:** Enabled
- **Executable:** `${workspaceFolder}/vendor/bin/phpstan`

## Testing

To test if PHPStan is working:

1. Open `packages/blockera/php/Providers/AppServiceProvider.php`
2. Look at line 447: `$locale = test2();`
3. Save the file (or run PHPStan manually)
4. Check the Problems panel - you should see an error about undefined function `test2()`

## Troubleshooting

If PHPStan still doesn't show errors:

1. **Verify PHPStan is installed:**
   ```bash
   vendor/bin/phpstan --version
   ```

2. **Run PHPStan manually to see if it works:**
   ```bash
   vendor/bin/phpstan analyse packages/blockera/php/Providers/AppServiceProvider.php
   ```

3. **Check PHPStan extension is installed:**
   - Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for "PHPStan"
   - Make sure `swordev.phpstan` is installed and enabled

4. **Reload VS Code:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Developer: Reload Window`

5. **Check PHPStan Output Panel:**
   - View → Output
   - Select "PHPStan" from dropdown
   - Look for any error messages

## Alternative: Use Intelephense (If Needed)

If you need real-time undefined function detection, you would need a language server like Intelephense. However, you specifically requested to remove it and use PHPCS/PHPStan instead.

The trade-off is:
- **PHPCS + PHPStan:** Better for coding standards, but requires manual/on-save analysis
- **Intelephense:** Real-time inline errors, but you wanted to avoid it

## Summary

- **PHPCS** = Coding standards only (formatting, style)
- **PHPStan** = Static analysis (undefined functions, type errors)
- **PHPStan Extension** = Runs analysis on save or command (not real-time inline)

For undefined function detection, use PHPStan (manually or on save), not PHPCS.


