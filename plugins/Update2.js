import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// 🧠 CONFIGURA AQUÍ TU REPO
const REPO_URL = 'https://github.com/CARLOSGRCIAGRCIA/DolphinBot.git'; // ← cambia esto
const REPO_BRANCH = 'main'; // ← o 'master' según tu repo

let handler = async (m) => {
  try {
    await m.reply(`🔄 Obteniendo actualizaciones desde:\n${REPO_URL} (${REPO_BRANCH})`);

    // Clona el repositorio en una carpeta temporal
    await execPromise(`rm -rf ./tmp-repo && git clone --depth=1 --branch ${REPO_BRANCH} ${REPO_URL} ./tmp-repo`);

    // Compara archivos entre el bot y la nueva versión
    const { stdout: diffOutput } = await execPromise('diff -qr ./tmp-repo ./ | grep -v ".git" || true');

    if (!diffOutput.trim()) {
      await execPromise('rm -rf ./tmp-repo');
      return m.reply('✅ El bot ya está actualizado. No hay cambios.');
    }

    // Copia solo archivos modificados
    await execPromise('cp -ru ./tmp-repo/* ./');
    await execPromise('rm -rf ./tmp-repo');

    // Generar resumen de cambios
    const resumen = diffOutput
      .split('\\n')
      .filter(Boolean)
      .map(linea => {
        if (linea.includes('Files')) {
          return '📄 Modificado: ' + linea.split(' and ')[0].replace('Files ', '').trim();
        } else if (linea.includes('Only in')) {
          return '🆕 Nuevo archivo: ' + linea.replace('Only in ', '').trim();
        } else {
          return '📁 ' + linea.trim();
        }
      }).join('\\n');

    await m.reply(`✅ Actualización completada.\n\n📋 Cambios detectados:\n${resumen}`);

  } catch (e) {
    console.error(e);
    await m.reply('❌ Error durante la actualización:\n' + e.message);
  }
};

handler.help = ['update2'];
handler.tags = ['tools'];
handler.command = /^update2$/i;

export default handler;
