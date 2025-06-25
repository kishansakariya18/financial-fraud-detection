import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Button, GhostSpinner } from 'components/ui';
import { AnimatedTick } from './AnimatedTick';

// ----------------------------------------------------------------------

function getMessages(itemType = 'module/provider') {
  return {
    block: {
      confirm: {
        Icon: ExclamationTriangleIcon,
        iconClassName: 'text-warning',
        title: `Block ${itemType}?`,
        description: `Are you sure you want to block this ${itemType}? This action can be reverted later.`,
        actionText: `Yes, Block`,
        cancelText: 'No'
      },
      reason: {
        Icon: ExclamationTriangleIcon,
        iconClassName: 'text-warning',
        title: `Reason for Blocking`,
        description: `Please provide a reason for blocking this ${itemType}.`,
        actionText: 'Submit',
        cancelText: 'Cancel'
      },
      success: {
        Icon: AnimatedTick,
        iconClassName: 'text-success',
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Blocked Successfully`,
        description: `The ${itemType} has been blocked.`,
        actionText: 'Done'
      },
      error: {
        Icon: XCircleIcon,
        iconClassName: 'text-error',
        title: 'Oops... Something failed.',
        description: `Ensure internet is on and retry. Contact support if issue remains.`,
        actionText: 'Retry',
        cancelText: 'Cancel'
      }
    },
    unblock: {
      confirm: {
        Icon: ExclamationTriangleIcon,
        iconClassName: 'text-warning',
        title: `Unblock ${itemType}?`,
        description: `Are you sure you want to unblock this ${itemType}?`,
        actionText: `Yes, Unblock`,
        cancelText: 'No'
      },
      success: {
        Icon: AnimatedTick,
        iconClassName: 'text-success',
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Unblocked Successfully`,
        description: `The ${itemType} has been unblocked.`,
        actionText: 'Done'
      },
      error: {
        Icon: XCircleIcon,
        iconClassName: 'text-error',
        title: 'Oops... Something failed.',
        description: `Ensure internet is on and retry. Contact support if issue remains.`,
        actionText: 'Retry',
        cancelText: 'Cancel'
      }
    }
  };
}

export function BlockUnblockModal({
  show,
  onClose,
  onSubmit,
  blocked = false,
  confirmLoading = false,
  className,
  error = false,
  errorMessage = '',
  onRetry,
  itemType = 'module/provider'
}) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'reason' | 'success' | 'error'
  const [reason, setReason] = useState('');
  const focusRef = useRef();

  // Reset step when modal opens/closes or error changes
  useEffect(() => {
    if (!show) {
      setStep('confirm');
      setReason('');
    } else if (error) {
      setStep('error');
    }
  }, [show, error]);

  const dialogProps = confirmLoading
    ? {
        onClose: () => {},
        static: true
      }
    : {
        onClose
      };

  const flow = blocked ? 'unblock' : 'block';
  const messages = getMessages(itemType);

  // Handlers
  const handleConfirm = () => {
    if (blocked) {
      setStep('success');
      onSubmit && onSubmit();
    } else {
      setStep('reason');
    }
  };

  const handleReasonSubmit = () => {
    setStep('success');
    onSubmit && onSubmit(reason);
  };

  const handleDone = () => {
    onClose && onClose();
  };

  const handleRetry = () => {
    setStep(blocked ? 'confirm' : 'reason');
    if (onRetry) onRetry();
  };

  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      initialFocus={focusRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      {...dialogProps}>
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40"
      />
      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={clsx(
          'scrollbar-sm relative flex w-full max-w-md flex-col overflow-y-auto rounded-lg bg-white px-4 py-6 text-center transition-opacity duration-300 dark:bg-dark-700 sm:px-5',
          className
        )}>
        {step === 'confirm' && (
          <ConfirmStep
            {...messages[flow].confirm}
            onCancel={onClose}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
            focusRef={focusRef}
          />
        )}
        {step === 'reason' && (
          <ReasonStep
            {...messages.block.reason}
            reason={reason}
            setReason={setReason}
            onCancel={onClose}
            onSubmit={handleReasonSubmit}
            confirmLoading={confirmLoading}
            focusRef={focusRef}
          />
        )}
        {step === 'success' && (
          <SuccessStep {...messages[flow].success} onDone={handleDone} focusRef={focusRef} />
        )}
        {step === 'error' && (
          <ErrorStep
            {...messages[flow].error}
            errorMessage={errorMessage}
            onCancel={onClose}
            onRetry={handleRetry}
            focusRef={focusRef}
          />
        )}
      </TransitionChild>
    </Transition>
  );
}

function ConfirmStep({
  Icon,
  iconClassName,
  title,
  description,
  actionText,
  cancelText,
  onCancel,
  onConfirm,
  confirmLoading,
  focusRef
}) {
  const spinner = <GhostSpinner variant="soft" className="size-4 border-2" />;
  return (
    <>
      <Icon className={clsx('mx-auto size-24 shrink-0', iconClassName)} />
      <div className="mt-4">
        <h3 className="text-xl text-gray-800 dark:text-dark-100">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs">{description}</p>
        <div className="mt-12 flex justify-center space-x-3 rtl:space-x-reverse">
          <Button onClick={onCancel} variant="outlined" className="h-9 min-w-[7rem]">
            {cancelText || 'Cancel'}
          </Button>
          <Button
            ref={focusRef}
            onClick={onConfirm}
            color="primary"
            className="h-9 min-w-[7rem] space-x-2 rtl:space-x-reverse">
            {confirmLoading && spinner}
            <span>{actionText}</span>
          </Button>
        </div>
      </div>
    </>
  );
}

function ReasonStep({
  Icon,
  iconClassName,
  title,
  description,
  actionText,
  cancelText,
  reason,
  setReason,
  onCancel,
  onSubmit,
  confirmLoading,
  focusRef
}) {
  const spinner = <GhostSpinner variant="soft" className="size-4 border-2" />;
  return (
    <>
      <Icon className={clsx('mx-auto size-24 shrink-0', iconClassName)} />
      <div className="mt-4">
        <h3 className="text-xl text-gray-800 dark:text-dark-100">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs">{description}</p>
        <textarea
          className="focus:border-primary mt-6 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none dark:bg-dark-600 dark:text-dark-50"
          rows={3}
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          ref={focusRef}
        />
        <div className="mt-8 flex justify-center space-x-3 rtl:space-x-reverse">
          <Button onClick={onCancel} variant="outlined" className="h-9 min-w-[7rem]">
            {cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={onSubmit}
            color="primary"
            className="h-9 min-w-[7rem] space-x-2 rtl:space-x-reverse"
            disabled={!reason.trim() || confirmLoading}>
            {confirmLoading && spinner}
            <span>{actionText}</span>
          </Button>
        </div>
      </div>
    </>
  );
}

function SuccessStep({ Icon, iconClassName, title, description, actionText, onDone, focusRef }) {
  return (
    <>
      <Icon className={clsx('mx-auto size-24 shrink-0', iconClassName)} />
      <div className="mt-4">
        <h3 className="text-xl text-gray-800 dark:text-dark-100">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs">{description}</p>
        <Button onClick={onDone} color="success" className="mt-12 h-9 min-w-[7rem]" ref={focusRef}>
          {actionText}
        </Button>
      </div>
    </>
  );
}

function ErrorStep({
  Icon,
  iconClassName,
  title,
  description,
  actionText,
  cancelText,
  errorMessage,
  onCancel,
  onRetry,
  focusRef
}) {
  return (
    <>
      <Icon className={clsx('mx-auto size-24 shrink-0', iconClassName)} />
      <div className="mt-4">
        <h3 className="text-xl text-error">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs text-error">{errorMessage || description}</p>
        <div className="mt-12 flex justify-center space-x-3 rtl:space-x-reverse">
          <Button onClick={onCancel} variant="outlined" className="h-9 min-w-[7rem]">
            {cancelText || 'Cancel'}
          </Button>
          <Button
            ref={focusRef}
            onClick={onRetry}
            color="error"
            className="h-9 min-w-[7rem] space-x-2 rtl:space-x-reverse">
            <span>{actionText}</span>
          </Button>
        </div>
      </div>
    </>
  );
}

BlockUnblockModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func, // For block: (reason) => void, for unblock: () => void
  blocked: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  onRetry: PropTypes.func,
  itemType: PropTypes.string
};
