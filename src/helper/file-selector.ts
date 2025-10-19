import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function selectPath(): Promise<string> {
  try {
    // Öffne System-Dialog für Ordner-Auswahl (macOS)
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
    // Fallback zur Konsolen-Auswahl oder Config-Datei. Müsste man hier noch implementieren
    return
  }
}

export {
  selectPath
}
