import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// TODO: Schöner schreiben (vor allem Deutsch)
async function selectPath(): Promise<string> {
  try {
    // Versuche System-Dialog
    const command = `osascript -e '
      tell application "System Events"
        activate
        set folderPath to choose folder with prompt "Wähle einen Ordner"
        set posixPath to POSIX path of folderPath
        return posixPath
      end tell
    '`;

    const { stdout } = await execAsync(command);
    const selectedPath = stdout.trim();

    if (selectedPath && selectedPath !== '' && !selectedPath.includes('User cancelled')) {
      return selectedPath;
    }
    throw new Error('Dialog abgebrochen');

  } catch (error) {
    // Fallback zur Konsolen-Auswahl
    return
  }
}
// Export für andere Module
export {
  selectPath
}
