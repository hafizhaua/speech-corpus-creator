interface File {
  id: number;
  name: string;
  format: string;
  type: "file"; // Corrected to specify type as 'file'
}

interface Folder {
  id: string | number;
  name: string;
  type: "folder"; // Corrected to specify type as 'folder'
  children?: FileSystemItem[]; // Recursive type definition
}

type FileSystemItem = Folder | File;

interface FileTreeProps {
  formValue: any;
}
