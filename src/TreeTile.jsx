import {
  Badge,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  //수정 테스트
} from '@mui/material';
import React from 'react';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

function TreeTile({
  handleDropDownOpen,
  haveChildren,
  childrenNum,
  hide,
  open,
  indentString,
  contentId,
  contentKey,
  contentValue,
  chipColor,
  handleValueEdit,
}) {
  return (
    !hide && (
      <>
        <div style={{ width: 'fit-content' }}>
          <div className='row'>
            {indentString}
            <Badge
              badgeContent={childrenNum}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color='success'
            >
              {' '}
              <IconButton id={contentId} onClick={handleDropDownOpen}>
                {haveChildren ? (
                  open ? (
                    <MdOutlineKeyboardArrowUp size={'20px'} />
                  ) : (
                    <MdOutlineKeyboardArrowDown size={'20px'} />
                  )
                ) : (
                  <div
                    className='colorChip'
                    style={{ backgroundColor: chipColor }}
                  />
                )}
              </IconButton>
            </Badge>
            <div className='key'>
              <Typography>{contentKey}</Typography>
            </div>
            <div className='sizedbox' />
            {contentValue !== null && (
              <TextField
                id={contentId}
                size='small'
                sx={{ zIndex: 999 }}
                value={contentValue.toString()}
                placeholder={contentValue === '' && 'No Value'}
                onChange={handleValueEdit}
                // onBlur={handleValueEdit}
              />
            )}
          </div>
        </div>{' '}
        <Divider />
      </>
    )
  );
}

export default TreeTile;
