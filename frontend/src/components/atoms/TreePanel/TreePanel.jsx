import { TreeStructure } from "@/components/organisms/TreeStructure/TreeStructure";

export const TreePanel = ({ width, onResizeStart }) => {
  return (
    <>
      <div 
        style={{ width: `${width}px` }}
        className="tree-panel"
      >
        <div className="tree-content">
          <TreeStructure />
        </div>
      </div>
      
      <div 
        onMouseDown={() => onResizeStart('tree')}
        className="resize-handle"
      />
    </>
  );
};