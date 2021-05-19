import * as React from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  theme,
  Heading,
  Spacer,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import ReactJson from 'react-json-view';
import Terminal from 'react-animated-term';
import 'react-animated-term/dist/react-animated-term.css';
import CSVReader from './components/csv-reader';
import Table from './components/table';
import AlertDialog from './components/alert-dialog';
import { handleCSVFile } from './utils';
import { mockData } from './utils/constant';
import useHover from './hooks/useHover';

const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
export const defaultTermLines = [
  { text: 'Please upload a .CSV file..', cmd: true },
];

function App() {
  const terminalRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const [hoverRef, isHovered] = useHover();
  const [tryDemoLoading, setTryDemoLoading] = React.useState(false);
  const [jsonData, setJSONData] = React.useState([]);
  const [replay, setReplay] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [termLines, setTermLines] = React.useState(defaultTermLines);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alertState, setAlertState] = React.useState(false);
  const [colorMode, setColorMode] = React.useState(
    window.localStorage.getItem('chakra-ui-color-mode')
  );

  React.useEffect(() => {
    if (jsonData.length) {
      const res = handleCSVFile(jsonData.slice(1));
      if (res.length) {
        const newTermLines = [
          {
            text: `node console.js ./${fileName}`,
            cmd: true,
          },
          {
            text: '✔ Loaded....',
            cmd: false,
            repeat: true,
            repeatCount: 1,
            delay: 40,
            frames: spinner.map(function (spinner) {
              return {
                text: spinner + ' Loading result..',
              };
            }),
          },
          {
            text: `${res}`,
            cmd: false,
          },
        ];
        setTermLines(newTermLines);
        setReplay(true);
      }
    } else {
      setTermLines(defaultTermLines);
    }
  }, [jsonData]);

  React.useEffect(() => {
    if (replay) {
      if (document.querySelector('.Terminal-control-btn')) {
        setTimeout(() => {
          document.querySelector('.Terminal-control-btn').click();
        }, 400);
        setTimeout(() => {
          setTryDemoLoading(false);
        }, 1200);
      }
    }
  }, [replay]);

  // use mock data
  const tryOnlineDemo = () => {
    if (jsonData.length) {
      setAlertState(true);
      return;
    }

    setTryDemoLoading(true);
    setFileName('online-demo.csv');
    setJSONData(mockData);
  };

  console.log('fileName = ', fileName);

  return (
    <ChakraProvider theme={theme}>
      <Box
        w="100%"
        h="100vh"
        overflow="auto"
        bgGradient={
          colorMode === 'light'
            ? [
                'linear(to-tr, teal.300, yellow.400)',
                'linear(to-t, blue.200, teal.500)',
                'linear(to-b, orange.100, purple.300)',
              ]
            : []
        }
      >
        <Flex fontSize="xl" width="1100px" mx="auto" paddingTop="10">
          <Spacer />
          <Heading as="h2" size="2xl">
            Console App Web Version
          </Heading>
          <Spacer />
          <ColorModeSwitcher
            justifySelf="flex-end"
            mr="4"
            setColorMode={setColorMode}
          />
        </Flex>
        <Box mx="auto" mt="20" width="500px">
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            width="600px"
            mb="3"
          >
            <Heading
              as="h5"
              size="sm"
              color={isHovered ? 'orange.300' : 'tomato'}
              ref={hoverRef}
            >
              Don't have a .CSV file? Click and try an online demo!
            </Heading>
            <Button
              size="sm"
              ml="3"
              textColor="gray.500"
              onClick={tryOnlineDemo}
              isLoading={tryDemoLoading}
              loadingText="Loading.."
            >
              Try demo
            </Button>
          </Box>
          <CSVReader
            setAlertState={setAlertState}
            setJSONData={setJSONData}
            setFileName={setFileName}
            setTermLines={setTermLines}
            setReplay={setReplay}
            setTryDemoLoading={setTryDemoLoading}
            jsonData={jsonData}
          />
        </Box>
        <Box
          maxWidth="900px"
          mx="auto"
          mt="10"
          display="flex"
          justifyContent="space-between"
        >
          <Box padding="2" flex="1">
            <Heading as="h2" size="md">
              Original JSON Data
            </Heading>
            {jsonData && jsonData.length ? (
              <Button onClick={onOpen} mt="2">
                View table
              </Button>
            ) : null}
            <Box mt="4">
              <ReactJson src={jsonData.slice(1)} displayDataTypes={false} />
            </Box>
          </Box>
          <Box padding="2" flex="2">
            <Heading as="h2" size="md" color="tomato">
              Console Output Data
            </Heading>
            <Box mt="4">
              <Terminal
                lines={termLines}
                interval={30}
                height={380}
                ref={terminalRef}
              />
            </Box>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Table View</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table data={jsonData} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
          onClose={setAlertState}
          isOpen={alertState}
          cancelRef={cancelRef}
          setTermLines={setTermLines}
          setReplay={setReplay}
          setJSONData={setJSONData}
          setFileName={setFileName}
          setTryDemoLoading={setTryDemoLoading}
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;
