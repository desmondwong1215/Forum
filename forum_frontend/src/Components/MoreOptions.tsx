import { useState } from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MoreOptionsProps } from '../lib/dataTypes';

function MoreOptions(props: MoreOptionsProps) {

  const [open, setOpen] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // toggle the popper when the moreVertIcon is clicked
  function handleClick(event: React.MouseEvent<HTMLElement>): void {
    props.setShowEdit(false);
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  // when edit button is clicked, popper should be closed and enter edit mode
  function handleEditClick(): void {
    props.setShowEdit(true);
    setAnchorEl(null);
    setOpen(false);
  }

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <div>
        <IconButton aria-label="settings" className="post-icon-box" onClick={handleClick}>
            <MoreVertIcon className="post-icon"/>
        </IconButton>

        {/* pop out or disappear when the moreVertIcon is clicked */}
        <Popper id={id} open={open} anchorEl={anchorEl} transition placement='right-start'>
            {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
                <Box 
                  sx={{ 
                    border: 1,
                    borderRadius: "5%",
                    width: "200px",
                    boxShadow: "3px 3px 10px black"}} 
                  className={props.isLight ? "light-mode-popper" : "dark-mode-popper"}>
                <Stack sx={{padding: "10px"}} direction='column' spacing={2}>

                    {/* One can only report the post that is not created by themselves */}
                    {props.sameUser 
                        ? <Button disabled>By You</Button>
                        : <Button>Report</Button>}

                    {/* One can only create one's own post */}
                    {props.sameUser && <Button onClick={handleEditClick}>Edit</Button>}

                    {/* delete button, confirmation and cancellation of deletion */}
                    {props.sameUser && (showDelete 
                        ? <Stack direction="row" spacing={2} sx={{justifyContent: "center"}}>
                            <Button onClick={props.delete}>Confirm</Button>
                            <Button onClick={() => setShowDelete(false)}>Back</Button>
                        </Stack>
                        : <Button onClick={() => setShowDelete(true)}>Delete</Button>)}
                </Stack>
                </Box>
            </Fade>
            )}
        </Popper>
    </div>
  );
}

export default MoreOptions;