// Import Dependencies
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Local Imports
import { Button } from 'components/ui';
import { RightSidebar } from './index';
import { pageHelpConfig } from 'app/constants/pageHelpConfig';
import { useTranslation } from 'react-i18next';
import { usePageHelp } from 'app/contexts/page-help/context';

// ----------------------------------------------------------------------

export function PageHelpDrawer() {
  const { t } = useTranslation();
  const { pageKey, context, isOpen, closeHelp } = usePageHelp();

  const buildContent = pageHelpConfig[pageKey];
  const content = useMemo(
    () => (buildContent ? buildContent(t, context) : null),
    [buildContent, t, context]
  );
  const sections = content?.sections ?? [];
  const hasContent = sections.length > 0;
  const defaultTitle = t('help');
  const emptyMessage = t('no_data_available');

  return (
    <RightSidebar
      renderTrigger={null}
      isOpen={Boolean(isOpen && pageKey)}
      onClose={closeHelp}
      backdropClassName="fixed inset-0 z-[60] bg-gray-900/20  transition-opacity dark:bg-white/10"
      headerContent={({ close }) => (
        <PageHelpHeader title={content?.title ?? defaultTitle} close={close} />
      )}
      bodyClassName="px-4">
      {hasContent ? <PageHelpBody sections={sections} /> : <EmptyState message={emptyMessage} />}
    </RightSidebar>
  );
}

export function PageHelpTrigger({ pageKey, payload }) {
  const { t } = useTranslation();
  const { openHelp, isOpen } = usePageHelp();

  const [suppressTooltip, setSuppressTooltip] = useState(false);
  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      setSuppressTooltip(true);
      const id = setTimeout(() => setSuppressTooltip(false), 400); // 300–400ms is enough
      return () => clearTimeout(id);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  if (!pageKey) return null;

  const tooltipProps = suppressTooltip
    ? {} // remove tooltip attrs while suppressed
    : { 'data-tooltip': true, 'data-tooltip-content': t('help') };
  return (
    <Button
      {...tooltipProps}
      onMouseLeave={() => setSuppressTooltip(false)} // re-arm on actual leave
      onClick={() => openHelp(pageKey, payload)}
      isIcon
      variant="flat"
      className="size-5 rounded-full group-hover/td:opacity-100"
      aria-label="Help Button">
      <QuestionMarkCircleIcon className="size-4 text-primary-600 dark:text-primary-300" />
    </Button>
  );
}

PageHelpTrigger.propTypes = {
  pageKey: PropTypes.string.isRequired,
  label: PropTypes.string,
  payload: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string
};

function PageHelpHeader({ title, close }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-dark-600">
      <p className="dark:text-dark-25 text-base font-semibold text-gray-900">{title}</p>
      <Button onClick={close} variant="flat" isIcon className="size-7 rounded-full">
        <XMarkIcon className="size-4" />
      </Button>
    </div>
  );
}

PageHelpHeader.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

function PageHelpBody({ sections }) {
  return (
    <div className="space-y-4 py-4 text-sm text-gray-700 dark:text-dark-100">
      {sections.map((section) => (
        <HelpSection key={section.title} section={section} />
      ))}
    </div>
  );
}

PageHelpBody.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.object).isRequired
};

function HelpSection({ section }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white/90 p-4 shadow-sm dark:border-dark-600 dark:bg-dark-800/60">
      <p className="dark:text-dark-25 text-sm font-semibold text-gray-900">{section.title}</p>
      {section.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-dark-100">{section.description}</p>
      )}
    </section>
  );
}

HelpSection.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    relatedFields: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

function EmptyState({ message }) {
  return (
    <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-dark-200">{message}</div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired
};
