import styled from '@emotion/styled'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import {
  StyledBalanceAmount,
  StyledBalanceTitle,
  StyledButton,
} from '../../App'
import { useStore } from '../../stores/rootStore'
import { TokenBalance } from './TokenBalance'

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export const Balances = observer(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [buyAmount, setBuyAmount] = useState(0)
  const [sellAmount, setSellAmount] = useState(0)
  const [tab, setTab] = useState(0)

  const { userStore } = useStore()

  const {
    tokenBalances,
    currentBalance,
    buyToken,
    sellToken,
    operationStatus,
  } = userStore

  useEffect(() => {
    if (operationStatus === 'success') {
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
      }, 6000)
    }
  }, [operationStatus])

  const handleOpen = () => {
    setIsOpen(value => !value)
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <StyledBalanceContainer>
        <StyledBalanceTitle>Ваш Баланс</StyledBalanceTitle>
        <StyledBalanceAmount>
          {currentBalance.toLocaleString('ru-RU')} ₽
        </StyledBalanceAmount>
        {Object.entries(tokenBalances).map(([token, amount]) => {
          return <TokenBalance title={token} amount={amount} />
        })}
      </StyledBalanceContainer>
      <StyledButton variant="contained" onClick={handleOpen}>
        Купить / Продать ТТ
      </StyledButton>
      <Dialog open={isOpen} onClose={handleOpen}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Купить" />
          <Tab label="Продать" />
        </Tabs>
        <CustomTabPanel value={tab} index={0}>
          <DialogTitle>Вы можете купить торговые токены России</DialogTitle>
          <StyledDialogContent>
            <DialogContentText>
              Количество
              <TextField
                fullWidth
                id="buy"
                value={buyAmount}
                onChange={(event: any) => setBuyAmount(event.target.value)}
                type="number"
                variant="standard"
              />{' '}
            </DialogContentText>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={handleOpen}>Отмена</Button>
            <Button
              onClick={() => {
                buyToken('ТТР', buyAmount)
                handleOpen()
                setBuyAmount(0)
              }}
            >
              Купить
            </Button>
          </DialogActions>
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <DialogTitle>Вы можете продать имеющиеся торговые токены</DialogTitle>
          <StyledDialogContent>
            <Select style={{ width: 150 }} value={'ТТР'}>
              <MenuItem value={'ТТР'}>ТТР</MenuItem>
              <MenuItem disabled value={'ТТК'}>
                ТТК
              </MenuItem>
              <MenuItem disabled value={'ТТИ'}>
                ТТИ
              </MenuItem>
            </Select>
            <DialogContentText>
              Количество
              <TextField
                fullWidth
                id="sell"
                value={sellAmount}
                onChange={(event: any) => setSellAmount(event.target.value)}
                type="number"
                variant="standard"
              />{' '}
            </DialogContentText>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={handleOpen}>Отмена</Button>
            <Button
              onClick={() => {
                sellToken('ТТР', sellAmount)
                handleOpen()
                setSellAmount(0)
              }}
            >
              Продать
            </Button>
          </DialogActions>
        </CustomTabPanel>
      </Dialog>
      <Snackbar
        open={isSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setIsSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Операция прошла успешно!
        </Alert>
      </Snackbar>
    </>
  )
})

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StyledBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
