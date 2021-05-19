import * as React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { CSVReader } from 'react-papaparse';
import { defaultTermLines } from '../App';

export default function CSVReaderComponent({
  setAlertState,
  setJSONData,
  setFileName,
  setTermLines,
  setReplay,
  setTryDemoLoading,
  jsonData,
  fileName,
}) {
  const buttonRef = React.useRef(null);

  const handleOpenDialog = e => {
    if (jsonData && jsonData.length) {
      setAlertState(true);
      return;
    }

    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = data => {
    const res = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i]?.data;
      const obj = {};
      obj['Transaction Date'] = item[0];
      obj['Vendor'] = item[1];
      obj['Product'] = item[2];
      obj['Amount'] = item[3];

      res.push(obj);
    }

    setJSONData(res);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log('handleOnError = ', err);
  };

  const handleOnRemoveFile = data => {
    setTermLines(defaultTermLines);
    setReplay(false);
    setJSONData([]);
    setFileName('');
    if (document.querySelector('.Terminal-control-btn')) {
      setTimeout(() => {
        document.querySelector('.Terminal-control-btn').click();
      }, 400);
      setTimeout(() => {
        setTryDemoLoading(false);
      }, 1000);
    }
  };

  const handleRemoveFile = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  return (
    <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnFileLoad}
      onError={handleOnError}
      noClick
      noDrag
      onRemoveFile={handleOnRemoveFile}
    >
      {({ file }) => {
        return (
          <aside
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10,
            }}
          >
            <Tooltip hasArrow label="Please upload a CSV file" fontSize="md">
              <button
                type="button"
                onClick={handleOpenDialog}
                style={{
                  borderTopLeftRadius: '5px',
                  borderBottomLeftRadius: '5px',
                  marginLeft: 0,
                  marginRight: 0,
                  width: '25%',
                  paddingLeft: 0,
                  paddingRight: 0,
                  background: 'gray',
                  height: 45,
                  alignSelf: 'center',
                  opacity: '0.8',
                  fontWeight: 'bold',
                }}
                // disabled={jsonData && jsonData.length ? true : false}
              >
                Upload File
              </button>
            </Tooltip>
            <div
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                height: 45,
                lineHeight: 2.5,
                marginTop: 5,
                marginBottom: 5,
                paddingLeft: 13,
                paddingTop: 2,
                width: '55%',
              }}
            >
              {file
                ? file.name
                : fileName
                ? fileName
                : 'Please click upload file button...'}
            </div>
            <button
              style={{
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20,
                background: 'red',
                height: 45,
                alignSelf: 'center',
                color: 'white',
                opacity: '0.8',
                fontWeight: 'bold',
              }}
              onClick={handleRemoveFile}
            >
              Remove
            </button>
          </aside>
        );
      }}
    </CSVReader>
  );
}
