import { useCallback, useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { Card, Button } from 'components/ui';
import clsx from 'clsx';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import { useSelector } from 'react-redux';
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

// Transform API data to react-d3-tree format
const transformDataToTree = (agents, userData) => {
  if (!agents || agents.length === 0) {
    return {
      name: 'No Data',
      attributes: {}
    };
  }

  // If there's only one root agent, use it directly
  if (agents.length === 1) {
    return transformAgent(agents[0]);
  }

  // If multiple root agents, create a virtual root
  return {
    name: userData?.Username || 'Agent Network',
    attributes: {
      isVirtualRoot: true
    },
    children: agents.map(transformAgent)
  };
};

const getDepth = (n) => {
  if (!n) return 0;
  const kids = n.children || [];
  if (!kids.length) return 1;
  return 1 + Math.max(...kids.map(getDepth));
};

const countLeaves = (n) => {
  if (!n) return 0;
  const kids = n.children || [];
  if (!kids.length) return 1;
  return kids.map(countLeaves).reduce((a, b) => a + b, 0);
};

const transformAgent = (agent) => {
  const node = {
    name: agent.Username,
    attributes: {
      agentUID: agent.AgentUID,
      agentID: agent.AgentID,
      firstName: agent.FirstName,
      lastName: agent.LastName,
      fullName: `${agent.FirstName} ${agent.LastName}`
    }
  };

  if (agent.ChildAgents && agent.ChildAgents.length > 0) {
    node.children = agent.ChildAgents.map(transformAgent);
  }

  return node;
};

// Custom node component
const CustomNode = ({ nodeDatum, toggleNode }) => {
  const isVirtualRoot = nodeDatum.attributes?.isVirtualRoot;
  const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

  if (isVirtualRoot) {
    return (
      <g>
        <circle
          r="25"
          fill="#6366f1"
          onClick={toggleNode}
          className="cursor-pointer transition-all hover:opacity-80"
        />
        <text
          fill="currentColor"
          strokeWidth="0"
          x="0"
          y="50"
          textAnchor="middle"
          className="pointer-events-none font-medium"
          style={{ fontSize: '22px', fontWeight: '600' }}>
          {nodeDatum.name}
        </text>
      </g>
    );
  }

  return (
    <g>
      {/* Node Circle */}
      <circle
        r="20"
        fill="#10b981"
        stroke="#059669"
        strokeWidth="2"
        onClick={toggleNode}
        className={clsx('transition-all', hasChildren ? 'cursor-pointer hover:opacity-80' : '')}
      />

      {/* Plus/Minus icon for nodes with children */}
      {hasChildren && (
        <text
          fill="white"
          strokeWidth="0"
          x="0"
          y="5"
          textAnchor="middle"
          className="pointer-events-none text-base font-bold">
          {nodeDatum.__rd3t.collapsed ? '+' : '-'}
        </text>
      )}

      {/* Username */}
      <text
        fill="currentColor"
        className="fill-gray-700 dark:fill-dark-200"
        strokeWidth="0"
        x="-20"
        y="36"
        textAnchor="start"
        style={{ fontSize: '18px', fontWeight: '600' }}>
        {nodeDatum.name}
      </text>

      {/* Full Name */}
      {/* <text
        fill="currentColor"
        className="fill-gray-500 dark:fill-dark-400"
        strokeWidth="0"
        x="-20"
        y="50"
        textAnchor="start"
        style={{ fontSize: '12px' }}>
        {nodeDatum.attributes?.fullName}
      </text> */}
    </g>
  );
};

CustomNode.propTypes = {
  nodeDatum: PropTypes.object.isRequired,
  toggleNode: PropTypes.func.isRequired
};

export default function TreeViewForAgents() {
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const [nodeSize, setNodeSize] = useState({ x: 200, y: 120 });
  const [separation, setSeparation] = useState({ siblings: 1.2, nonSiblings: 1.4 });
  const [zoom, setZoom] = useState(0.8);
  const [orientation, setOrientation] = useState('horizontal');
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [treeKey, setTreeKey] = useState(0);

  // Fetch agent tree data
  const fetchAgentTree = useCallback(async () => {
    setLoading(true);
    try {
      const { response } = await B2BAgentService.getAgentTree();
      const transformedData = transformDataToTree(response?.data || [], userData);
      setTreeData(transformedData);
    } catch (error) {
      toast.error(error || 'Failed to load agent tree');
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  // Auto fit the tree to the container
  const handleAutoFit = useCallback(() => {
    if (!containerRef.current || !treeData) return;

    const depth = getDepth(treeData);
    const leaves = countLeaves(treeData);

    const { width, height } = containerRef.current.getBoundingClientRect();

    // Adjust node spacing and calculations based on orientation
    let nx, ny, estWidth, estHeight, calculatedZoom;

    if (orientation === 'horizontal') {
      // Horizontal: tree grows left to right
      nx = 180; // horizontal spacing between levels
      ny = 100; // vertical spacing between siblings
      setNodeSize({ x: nx, y: ny });

      // Calculate separation based on number of nodes
      const sibSep = leaves > 20 ? 1 : leaves > 10 ? 1.1 : 1.2;
      const nonSibSep = sibSep + 0.2;
      setSeparation({ siblings: sibSep, nonSiblings: nonSibSep });

      // Estimate dimensions: depth affects width, leaves affect height
      estWidth = Math.max(1, depth) * nx * 1.1;
      estHeight = Math.max(1, leaves) * ny * sibSep;

      // Calculate zoom
      calculatedZoom = Math.max(
        0.2,
        Math.min(1.5, Math.min(width / (estWidth * 1.2), height / (estHeight * 1.2)))
      );
      setZoom(calculatedZoom);

      // Position tree at left center
      setTranslate({ x: 100, y: height / 2 });
    } else {
      // Vertical: tree grows top to bottom
      nx = 180; // horizontal spacing between siblings
      ny = 140; // vertical spacing between levels
      setNodeSize({ x: nx, y: ny });

      // Calculate separation
      const sibSep = leaves > 20 ? 0.8 : leaves > 10 ? 1 : 1.2;
      const nonSibSep = sibSep + 0.2;
      setSeparation({ siblings: sibSep, nonSiblings: nonSibSep });

      // Estimate dimensions: leaves affect width, depth affects height
      estWidth = Math.max(1, leaves) * nx * sibSep;
      estHeight = Math.max(1, depth) * ny * 1.1;

      // Calculate zoom with more conservative padding for vertical
      calculatedZoom = Math.max(
        0.15,
        Math.min(1.2, Math.min(width / (estWidth * 1.3), height / (estHeight * 1.3)))
      );
      setZoom(calculatedZoom);

      // Position tree at top center
      setTranslate({ x: width / 2, y: 100 });
    }
  }, [treeData, orientation]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.1));
  };

  // const handleResetZoom = () => {
  //   setZoom(0.8);
  // };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
  };

  // Expand/Collapse all nodes
  const handleExpandCollapseAll = () => {
    setIsAllExpanded((prev) => !prev);
    // Force tree to re-render with new collapse state
    setTreeKey((prev) => prev + 1);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAgentTree();
  }, [fetchAgentTree]);

  // Auto fit when data changes or orientation changes
  useEffect(() => {
    if (treeData && containerRef.current) {
      // Small delay to ensure container is rendered
      const timer = setTimeout(() => {
        handleAutoFit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [treeData, handleAutoFit]);

  if (loading) {
    return (
      <Card className="flex h-[600px] items-center justify-center">
        <div className="text-gray-500 dark:text-dark-400">Loading agent tree...</div>
      </Card>
    );
  }

  if (!treeData || treeData.name === 'No Data') {
    return (
      <Card className="flex h-[600px] items-center justify-center">
        <div className="text-gray-500 dark:text-dark-400">No agent data available</div>
      </Card>
    );
  }

  return (
    <Card className="relative flex flex-col overflow-hidden">
      {/* Tree Container */}
      <div
        ref={containerRef}
        className="w-full flex-1 bg-white dark:bg-dark-800"
        style={{
          minHeight: 'calc(100vh - 200px)'
        }}>
        <Tree
          key={treeKey}
          data={treeData}
          translate={translate}
          orientation={orientation}
          pathFunc="step"
          separation={separation}
          nodeSize={nodeSize}
          renderCustomNodeElement={(rd3tProps) => (
            <CustomNode {...rd3tProps} toggleNode={rd3tProps.toggleNode} />
          )}
          pathClassFunc={() => 'stroke-gray-300 dark:stroke-dark-600 stroke-2'}
          enableLegacyTransitions={true}
          transitionDuration={300}
          collapsible={true}
          shouldCollapseNeighborNodes={false}
          initialDepth={isAllExpanded ? undefined : 1}
          zoom={zoom}
          scaleExtent={{ min: 0.1, max: 2 }}
          draggable={true}
          zoomable={true}
        />
      </div>

      {/* Control Panel */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 p-3 dark:border-dark-600 dark:bg-dark-700">
        {/* Left side - Zoom info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-dark-300">
            Zoom: {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Center - Main controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={handleZoomOut}
            disabled={zoom <= 0.1}
            className="size-9"
            title="Zoom Out">
            <MagnifyingGlassMinusIcon className="size-5" />
          </Button>

          {/* Zoom In */}
          <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={handleZoomIn}
            disabled={zoom >= 2}
            className="size-9"
            title="Zoom In">
            <MagnifyingGlassPlusIcon className="size-5" />
          </Button>

          {/* Reset Zoom */}
          {/* <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={handleResetZoom}
            className="size-9"
            title="Reset Zoom">
            <ArrowPathIcon className="size-5" />
          </Button> */}

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-dark-500" />

          {/* Fit to Screen */}
          <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={handleAutoFit}
            className="size-9"
            title="Fit to Screen">
            <ArrowsPointingOutIcon className="size-5" />
          </Button>

          {/* Expand/Collapse All */}
          <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={handleExpandCollapseAll}
            className="size-9"
            title={isAllExpanded ? 'Collapse All' : 'Expand All'}>
            {isAllExpanded ? (
              <ChevronUpIcon className="size-5" />
            ) : (
              <ChevronDownIcon className="size-5" />
            )}
          </Button>

          {/* Toggle Orientation */}
          <Button
            variant="soft"
            color="neutral"
            isIcon
            onClick={toggleOrientation}
            className="size-9"
            title={`Switch to ${orientation === 'horizontal' ? 'Vertical' : 'Horizontal'}`}>
            {orientation === 'horizontal' ? (
              <Bars3BottomLeftIcon className="size-5" />
            ) : (
              <Bars3Icon className="size-5" />
            )}
          </Button>
        </div>

        {/* Right side - Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-dark-300">
            {orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </span>
        </div>
      </div>
    </Card>
  );
}

TreeViewForAgents.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      AgentID: PropTypes.number,
      AgentUID: PropTypes.string,
      Username: PropTypes.string,
      FirstName: PropTypes.string,
      LastName: PropTypes.string,
      ChildAgents: PropTypes.array
    })
  ),
  loading: PropTypes.bool
};
