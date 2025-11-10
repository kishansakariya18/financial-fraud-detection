// Import Dependencies
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

// Local Imports
import { Button, ScrollShadow } from 'components/ui';
import { useDisclosure } from 'hooks';
import VerticalSliderIcon from 'assets/dualicons/vertical-slider.svg?react';
import { Header } from './Header';

// ----------------------------------------------------------------------

export function RightSidebar({
  renderTrigger,
  headerContent,
  children,
  bodyClassName,
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
  backdropClassName
}) {
  const [uncontrolledIsOpen, { open, close }] = useDisclosure(false, { onOpen, onClose });
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const handleOpen = isControlled ? () => onOpen?.() : open;
  const handleClose = isControlled ? () => onClose?.() : close;

  let trigger = null;
  if (renderTrigger === null) {
    trigger = null;
  } else if (typeof renderTrigger === 'function') {
    trigger = renderTrigger(handleOpen);
  } else {
    trigger = (
      <Button onClick={handleOpen} variant="flat" isIcon className="relative size-9 rounded-full">
        <VerticalSliderIcon className="size-6" />
      </Button>
    );
  }

  return (
    <>
      {trigger}
      <RightSidebarContent
        isOpen={isOpen}
        close={handleClose}
        headerContent={headerContent}
        bodyClassName={bodyClassName}
        backdropClassName={backdropClassName}>
        {children}
      </RightSidebarContent>
    </>
  );
}

RightSidebar.propTypes = {
  renderTrigger: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  headerContent: PropTypes.func,
  children: PropTypes.node,
  bodyClassName: PropTypes.string,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  backdropClassName: PropTypes.string
};

function RightSidebarContent({
  isOpen,
  close,
  headerContent,
  children,
  bodyClassName,
  backdropClassName
}) {
  return (
    <Transition show={isOpen}>
      <Dialog open={true} onClose={close} static autoFocus>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={clsx(
            'fixed inset-0 z-[60] transition-opacity',
            backdropClassName ?? 'bg-gray-900/50 backdrop-blur dark:bg-black/40'
          )}></TransitionChild>

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed inset-y-0 right-0 z-[61] flex w-screen transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-750 sm:inset-y-2 sm:mx-2 sm:w-80 sm:rounded-xl">
          {headerContent ? headerContent({ close }) : <Header close={close} />}
          <ScrollShadow
            size={4}
            className={clsx(
              'hide-scrollbar overflow-y-auto overscroll-contain pb-5',
              bodyClassName
            )}>
            {children ?? <div className="px-4 italic">Start magic form here</div>}
          </ScrollShadow>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

RightSidebarContent.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  headerContent: PropTypes.func,
  children: PropTypes.node,
  bodyClassName: PropTypes.string,
  backdropClassName: PropTypes.string
};
