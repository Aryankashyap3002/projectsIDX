
import React from 'react';
import { 
  FileText, 
  FileCode, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  File,
  Settings,
  Database,
  FileSpreadsheet,
  Palette,
  Globe,
  Coffee,
  Zap,
  Package,
  FileX,
  FileCheck,
  FileJson,
  FileCog
} from 'lucide-react';

export const FileIcon = ({ extension, size = 20, className = "" }) => {
  const getIconColor = (ext) => {
    const colorMap = {
      'js': 'text-yellow-500',
      'jsx': 'text-blue-400',
      'ts': 'text-blue-600',
      'tsx': 'text-blue-500',
      'html': 'text-orange-500',
      'css': 'text-blue-500',
      'scss': 'text-pink-500',
      'sass': 'text-pink-500',
      'json': 'text-green-500',
      'xml': 'text-green-600',
      'md': 'text-gray-600',
      'py': 'text-green-600',
      'java': 'text-red-600',
      'php': 'text-purple-600',
      'rb': 'text-red-500',
      'go': 'text-cyan-500',
      'rs': 'text-orange-600',
      'c': 'text-blue-700',
      'cpp': 'text-blue-700',
      'png': 'text-green-500',
      'jpg': 'text-green-500',
      'jpeg': 'text-green-500',
      'gif': 'text-green-500',
      'svg': 'text-orange-500',
      'mp4': 'text-red-500',
      'avi': 'text-red-500',
      'mov': 'text-red-500',
      'mp3': 'text-purple-500',
      'wav': 'text-purple-500',
      'zip': 'text-yellow-600',
      'rar': 'text-yellow-600',
      'pdf': 'text-red-600',
      'doc': 'text-blue-600',
      'docx': 'text-blue-600',
      'xls': 'text-green-600',
      'xlsx': 'text-green-600',
      'ppt': 'text-orange-600',
      'pptx': 'text-orange-600',
      'txt': 'text-gray-500',
      'log': 'text-gray-500',
      'env': 'text-yellow-500',
      'config': 'text-gray-600',
      'yml': 'text-purple-500',
      'yaml': 'text-purple-500',
      'toml': 'text-orange-500',
      'ini': 'text-gray-600',
      'sql': 'text-blue-500',
      'db': 'text-blue-700',
      'sqlite': 'text-blue-700',
      'vue': 'text-green-500',
      'svelte': 'text-orange-500',
      'angular': 'text-red-600',
      'dart': 'text-blue-500',
      'swift': 'text-orange-500',
      'kotlin': 'text-purple-500',
      'sh': 'text-green-700',
      'bash': 'text-green-700',
      'bat': 'text-green-700',
      'ps1': 'text-blue-600',
      'dockerfile': 'text-blue-500',
      'gitignore': 'text-orange-500',
      'license': 'text-gray-600',
      'readme': 'text-blue-500',
      'makefile': 'text-orange-600',
      'gradle': 'text-green-600',
      'maven': 'text-red-500',
      'npm': 'text-red-600',
      'yarn': 'text-blue-500',
      'lock': 'text-gray-600'
    };
    
    return colorMap[ext?.toLowerCase()] || 'text-gray-500';
  };

  const fileIconMapper = {
    // JavaScript & TypeScript
    'js': <Coffee size={size} className={`${getIconColor('js')} ${className}`} />,
    'jsx': <FileCode size={size} className={`${getIconColor('jsx')} ${className}`} />,
    'ts': <FileCode size={size} className={`${getIconColor('ts')} ${className}`} />,
    'tsx': <FileCode size={size} className={`${getIconColor('tsx')} ${className}`} />,
    'mjs': <Coffee size={size} className={`${getIconColor('js')} ${className}`} />,
    'cjs': <Coffee size={size} className={`${getIconColor('js')} ${className}`} />,
    
    // Web Technologies
    'html': <Globe size={size} className={`${getIconColor('html')} ${className}`} />,
    'htm': <Globe size={size} className={`${getIconColor('html')} ${className}`} />,
    'css': <Palette size={size} className={`${getIconColor('css')} ${className}`} />,
    'scss': <Palette size={size} className={`${getIconColor('scss')} ${className}`} />,
    'sass': <Palette size={size} className={`${getIconColor('sass')} ${className}`} />,
    'less': <Palette size={size} className={`${getIconColor('scss')} ${className}`} />,
    'stylus': <Palette size={size} className={`${getIconColor('scss')} ${className}`} />,
    
    // Data & Config
    'json': <FileJson size={size} className={`${getIconColor('json')} ${className}`} />,
    'xml': <FileCode size={size} className={`${getIconColor('xml')} ${className}`} />,
    'yaml': <FileCog size={size} className={`${getIconColor('yaml')} ${className}`} />,
    'yml': <FileCog size={size} className={`${getIconColor('yml')} ${className}`} />,
    'toml': <FileCog size={size} className={`${getIconColor('toml')} ${className}`} />,
    'ini': <FileCog size={size} className={`${getIconColor('ini')} ${className}`} />,
    'env': <Settings size={size} className={`${getIconColor('env')} ${className}`} />,
    'config': <Settings size={size} className={`${getIconColor('config')} ${className}`} />,
    
    // Documentation
    'md': <FileText size={size} className={`${getIconColor('md')} ${className}`} />,
    'mdx': <FileText size={size} className={`${getIconColor('md')} ${className}`} />,
    'txt': <FileText size={size} className={`${getIconColor('txt')} ${className}`} />,
    'log': <FileText size={size} className={`${getIconColor('log')} ${className}`} />,
    'readme': <FileText size={size} className={`${getIconColor('readme')} ${className}`} />,
    'license': <FileText size={size} className={`${getIconColor('license')} ${className}`} />,
    
    // Programming Languages
    'py': <FileCode size={size} className={`${getIconColor('py')} ${className}`} />,
    'java': <Coffee size={size} className={`${getIconColor('java')} ${className}`} />,
    'php': <FileCode size={size} className={`${getIconColor('php')} ${className}`} />,
    'rb': <FileCode size={size} className={`${getIconColor('rb')} ${className}`} />,
    'go': <FileCode size={size} className={`${getIconColor('go')} ${className}`} />,
    'rs': <FileCode size={size} className={`${getIconColor('rs')} ${className}`} />,
    'c': <FileCode size={size} className={`${getIconColor('c')} ${className}`} />,
    'cpp': <FileCode size={size} className={`${getIconColor('cpp')} ${className}`} />,
    'h': <FileCode size={size} className={`${getIconColor('c')} ${className}`} />,
    'hpp': <FileCode size={size} className={`${getIconColor('cpp')} ${className}`} />,
    'cs': <FileCode size={size} className={`${getIconColor('cs')} ${className}`} />,
    'swift': <FileCode size={size} className={`${getIconColor('swift')} ${className}`} />,
    'kotlin': <FileCode size={size} className={`${getIconColor('kotlin')} ${className}`} />,
    'dart': <FileCode size={size} className={`${getIconColor('dart')} ${className}`} />,
    
    // Frontend Frameworks
    'vue': <FileCode size={size} className={`${getIconColor('vue')} ${className}`} />,
    'svelte': <FileCode size={size} className={`${getIconColor('svelte')} ${className}`} />,
    
    // Images
    'png': <FileImage size={size} className={`${getIconColor('png')} ${className}`} />,
    'jpg': <FileImage size={size} className={`${getIconColor('jpg')} ${className}`} />,
    'jpeg': <FileImage size={size} className={`${getIconColor('jpeg')} ${className}`} />,
    'gif': <FileImage size={size} className={`${getIconColor('gif')} ${className}`} />,
    'svg': <FileImage size={size} className={`${getIconColor('svg')} ${className}`} />,
    'webp': <FileImage size={size} className={`${getIconColor('png')} ${className}`} />,
    'ico': <FileImage size={size} className={`${getIconColor('png')} ${className}`} />,
    'bmp': <FileImage size={size} className={`${getIconColor('png')} ${className}`} />,
    
    // Video
    'mp4': <FileVideo size={size} className={`${getIconColor('mp4')} ${className}`} />,
    'avi': <FileVideo size={size} className={`${getIconColor('avi')} ${className}`} />,
    'mov': <FileVideo size={size} className={`${getIconColor('mov')} ${className}`} />,
    'wmv': <FileVideo size={size} className={`${getIconColor('mp4')} ${className}`} />,
    'flv': <FileVideo size={size} className={`${getIconColor('mp4')} ${className}`} />,
    'webm': <FileVideo size={size} className={`${getIconColor('mp4')} ${className}`} />,
    
    // Audio
    'mp3': <FileAudio size={size} className={`${getIconColor('mp3')} ${className}`} />,
    'wav': <FileAudio size={size} className={`${getIconColor('wav')} ${className}`} />,
    'flac': <FileAudio size={size} className={`${getIconColor('mp3')} ${className}`} />,
    'aac': <FileAudio size={size} className={`${getIconColor('mp3')} ${className}`} />,
    'ogg': <FileAudio size={size} className={`${getIconColor('mp3')} ${className}`} />,
    
    // Archives
    'zip': <FileArchive size={size} className={`${getIconColor('zip')} ${className}`} />,
    'rar': <FileArchive size={size} className={`${getIconColor('rar')} ${className}`} />,
    'tar': <FileArchive size={size} className={`${getIconColor('zip')} ${className}`} />,
    'gz': <FileArchive size={size} className={`${getIconColor('zip')} ${className}`} />,
    '7z': <FileArchive size={size} className={`${getIconColor('zip')} ${className}`} />,
    
    // Database
    'sql': <Database size={size} className={`${getIconColor('sql')} ${className}`} />,
    'db': <Database size={size} className={`${getIconColor('db')} ${className}`} />,
    'sqlite': <Database size={size} className={`${getIconColor('sqlite')} ${className}`} />,
    'mongodb': <Database size={size} className={`${getIconColor('db')} ${className}`} />,
    
    // Office Documents
    'pdf': <FileText size={size} className={`${getIconColor('pdf')} ${className}`} />,
    'doc': <FileText size={size} className={`${getIconColor('doc')} ${className}`} />,
    'docx': <FileText size={size} className={`${getIconColor('docx')} ${className}`} />,
    'xls': <FileSpreadsheet size={size} className={`${getIconColor('xls')} ${className}`} />,
    'xlsx': <FileSpreadsheet size={size} className={`${getIconColor('xlsx')} ${className}`} />,
    'ppt': <FileText size={size} className={`${getIconColor('ppt')} ${className}`} />,
    'pptx': <FileText size={size} className={`${getIconColor('pptx')} ${className}`} />,
    
    // Shell Scripts
    'sh': <FileCode size={size} className={`${getIconColor('sh')} ${className}`} />,
    'bash': <FileCode size={size} className={`${getIconColor('bash')} ${className}`} />,
    'bat': <FileCode size={size} className={`${getIconColor('bat')} ${className}`} />,
    'ps1': <FileCode size={size} className={`${getIconColor('ps1')} ${className}`} />,
    'zsh': <FileCode size={size} className={`${getIconColor('sh')} ${className}`} />,
    
    // Package & Build Files
    'package': <Package size={size} className={`${getIconColor('npm')} ${className}`} />,
    'npm': <Package size={size} className={`${getIconColor('npm')} ${className}`} />,
    'yarn': <Package size={size} className={`${getIconColor('yarn')} ${className}`} />,
    'dockerfile': <FileCode size={size} className={`${getIconColor('dockerfile')} ${className}`} />,
    'makefile': <FileCog size={size} className={`${getIconColor('makefile')} ${className}`} />,
    'gradle': <FileCog size={size} className={`${getIconColor('gradle')} ${className}`} />,
    'maven': <FileCog size={size} className={`${getIconColor('maven')} ${className}`} />,
    'lock': <FileCheck size={size} className={`${getIconColor('lock')} ${className}`} />,
    'gitignore': <FileX size={size} className={`${getIconColor('gitignore')} ${className}`} />,
    
    // React specific
    'stories': <FileCode size={size} className={`${getIconColor('jsx')} ${className}`} />,
    'test': <FileCheck size={size} className={`${getIconColor('js')} ${className}`} />,
    'spec': <FileCheck size={size} className={`${getIconColor('js')} ${className}`} />,
  };

  
  return (
    <>
      {fileIconMapper[extension]}
    </>
  );
};