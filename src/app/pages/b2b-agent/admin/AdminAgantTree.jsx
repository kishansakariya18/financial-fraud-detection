import TreeViewForAgents from 'components/sections/b2b-agents/TreeViewForAgents';
import { Page } from 'components/shared/Page';

export default function AdminAgentTree() {
  return (
    <Page title={`Agent Tree View`}>
      <div className="flex flex-col space-y-4 px-[--margin-x] pt-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-100">
            Agent Tree View
          </h1>
        </div>
        <TreeViewForAgents />
      </div>
    </Page>
  );
}
