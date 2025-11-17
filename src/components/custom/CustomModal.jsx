// Import Dependencies
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useRef } from 'react';

// Local Imports
import { Button } from 'components/ui';
import PropTypes from 'prop-types';

export const CustomModal = ({
  description = '',
  title = '',
  btnTitle = '',
  children,
  btnColor = '',
  icon = '',
  btnClassName = '',
  show = false,
  onOpen = () => {},
  onClose = () => {},
  isShowBtn = false,
  modalFooter = null,
  sizeClass = ''
}) => {
  const saveRef = useRef(null);

  return (
    <>
      {isShowBtn && (
        <Button onClick={onOpen} color={btnColor} className={btnClassName}>
          {icon ? icon : <PlusIcon className="size-5" />}
          <span>{btnTitle}</span>
        </Button>
      )}

      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
          onClose={onClose}
          initialFocus={saveRef}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <DialogPanel
              className={clsx(
                'relative flex w-full origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700',
                sizeClass || 'max-w-lg'
              )}>
              <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-medium text-gray-800 dark:text-dark-100">
                  {title}
                </DialogTitle>
                <Button
                  onClick={onClose}
                  variant="flat"
                  isIcon
                  className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5">
                  <XMarkIcon className="size-4.5" />
                </Button>
              </div>

              <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
                <p>{description}</p>
                {children}
              </div>
              {modalFooter && (
                <div className="flex justify-center space-x-3 py-4 rtl:space-x-reverse">
                  {modalFooter}
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
};

CustomModal.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  btnTitle: PropTypes.string,
  children: PropTypes.node,
  btnColor: PropTypes.string,
  icon: PropTypes.node,
  btnClassName: PropTypes.string,
  show: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isShowBtn: PropTypes.bool,
  panalClassName: PropTypes.string,
  modalFooter: PropTypes.node,
  sizeClass: PropTypes.oneOf([
    'max-w-lg',
    'max-w-xl',
    'max-w-2xl',
    'max-w-3xl',
    'max-w-4xl',
    'max-w-5xl',
    'max-w-6xl',
    'max-w-7xl',
    'max-w-8xl',
    'max-w-9xl',
    'max-w-10xl'
  ])
};
