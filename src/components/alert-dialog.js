import * as React from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { defaultTermLines } from '../App';

export default function AlertDialogComp({
  isOpen,
  onClose,
  cancelRef,
  setTermLines,
  setReplay,
  setJSONData,
  setFileName,
  setTryDemoLoading,
}) {
  const handleClose = () => onClose(false);

  const handleRemoveFile = () => {
    setTermLines(defaultTermLines);
    setReplay(false);
    setFileName('');
    setJSONData([]);
    handleClose();
    if (document.querySelector('.Terminal-control-btn')) {
      setTimeout(() => {
        document.querySelector('.Terminal-control-btn').click();
      }, 400);
      setTimeout(() => {
        setTryDemoLoading(false);
      }, 1200);
    }
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Please remove first</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to remove current CSV file?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={handleClose}>
            No
          </Button>
          <Button colorScheme="red" ml={3} onClick={handleRemoveFile}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
