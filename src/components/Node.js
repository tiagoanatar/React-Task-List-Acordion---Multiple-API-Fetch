import React, {useState, useEffect} from "react"; // ***
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  makeStyles,
  Box,
} from "@material-ui/core";
import colors from "../constants/colors";
import Status from "./Status";

const Node = ({ node, expanded, toggleNodeExpanded }) => {
  const classes = useStyles();

  // My Code

  const [task, setTask] = useState([])
  const [state, setState] = useState('')

  useEffect(() => {
    const getTasks = async () => {
      const serverTask = await fetchTask()
      console.log(serverTask)
      setTask(serverTask)
    }

    getTasks()
  }, [])

  const fetchTask = async () => {
    try {
      const url = `${node.url}/api/v1/blocks`
      setState('Loading')
      const res = await fetch(url)
      const data = await res.json()
      const destruct = data.data
      setState('')
      return destruct
    } catch {
      setState('Error')
    }
  }

  //

  return (
    <Accordion
      elevation={3}
      className={classes.root}
      expanded={expanded}
      onChange={() => toggleNodeExpanded(node)}
    >
      <AccordionSummary
        className={classes.summary}
        classes={{
          expandIcon: classes.icon,
          content: classes.content,
          expanded: classes.expanded,
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box className={classes.summaryContent}>
          <Box>
            <Typography variant="h5" className={classes.heading}>
              {node.name || "Unknown"}
            </Typography>
            <Typography
              variant="subtitle1"
              className={classes.secondaryHeading}
            >
              {node.url}
            </Typography>
          </Box>
          <Status loading={node.loading} online={node.online} />
        </Box>
      </AccordionSummary>


      <AccordionDetails className={classes.boxMain}>
        { task !== undefined ? task.map((item) =>
        (
          <Box key={item.id} className={classes.boxStyle}>
              <Typography className={classes.boxID} component='p'>{item.id}</Typography>
              <Typography className={classes.boxText} component='p'>{item.attributes.data}</Typography>
          </Box>
        )) : '' }

        <Box>
        {state == 'Error' ? 'Error' : '' }
        {state == 'Loading' ? 'Loading' : '' }
        </Box>
      </AccordionDetails>


    </Accordion>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "16px 0",
    boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.15)",
    "&:before": {
      backgroundColor: "unset",
    },
  },
  summary: {
    padding: "0 24px",
  },
  summaryContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
  },
  icon: {
    color: colors.faded,
  },
  content: {
    margin: "10px 0 !important", // Avoid change of sizing on expanded
  },
  expanded: {
    "& $icon": {
      paddingLeft: 0,
      paddingRight: 12,
      top: -10,
      marginRight: 0,
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(17),
    display: "block",
    color: colors.text,
    lineHeight: 1.5,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: colors.faded,
    lineHeight: 2,
  },
  boxMain: { // ***
    flexWrap: 'wrap',
  },
  boxStyle: {
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    flexShrink: 0,
    flex: '0 0 100%',
  },
  boxID: { // ***
    color: '#304FFE',
    padding:'8px 8px 4px 8px',
  },
  boxText: {
    padding:'0px 8px 8px 8px',
  }
}));

Node.propTypes = {
  node: PropTypes.shape({
    url: PropTypes.string,
    online: PropTypes.bool,
    name: PropTypes.string,
    loading: PropTypes.bool,
  }).isRequired,
  expanded: PropTypes.bool,
  toggleNodeExpanded: PropTypes.func.isRequired,
};

export default Node;
