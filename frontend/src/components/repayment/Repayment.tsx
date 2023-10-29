import styled from '@emotion/styled'
import OilBarrelOutlinedIcon from '@mui/icons-material/OilBarrelOutlined'
import {
  Drawer,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useStore } from '../../stores/rootStore'
import {
  CustomTabPanel,
  StyledAmount,
  StyledCloseIcon,
  StyledDrawerContainer,
  StyledDrawerContent,
} from '../balance/Balances'
import { StyledButton } from '../menu/Icons'

export const Repayment = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isTablet = useMediaQuery('(max-width: 768px)')
  const { userStore } = useStore()
  const [tab, setTab] = useState(0)
  const [selectedId, setSelectedId] = useState<string>()

  const { redeemToken, tokenBalances, operationStatus, nomenclatureGoods } =
    userStore

  const [amount, setAmount] = useState(
    tokenBalances['ТТР'] > 100 ? 100 : tokenBalances['ТТР'],
  )

  const handleOpen = () => {
    setIsOpen(value => !value)
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <StyledDrawerContainer isTablet={isTablet}>
          <StyledCloseIcon onClick={() => setIsOpen(false)} />
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Погашение токена" />
          </Tabs>
          <CustomTabPanel value={tab} index={0}>
            <StyledDrawerContent>
              <StyledRow>
                <Typography>Выбранный токен</Typography>

                <Typography style={{ paddingRight: 20 }}>Количество</Typography>
              </StyledRow>
              <StyledRow>
                <Select style={{ width: 150 }} value={'ТТР'}>
                  <MenuItem value={'ТТР'}>ТТР</MenuItem>
                  <MenuItem disabled value={'ТТК'}>
                    ТТК
                  </MenuItem>
                  <MenuItem disabled value={'ТТИ'}>
                    ТТИ
                  </MenuItem>
                </Select>
                <StyledAmount
                  style={{ width: 125 }}
                  id="buy"
                  value={amount}
                  onChange={(event: any) => {
                    if (event.target.value >= 0) setAmount(event.target.value)
                    else setAmount(0)
                  }}
                  type="number"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                />
              </StyledRow>

              <StyledGoodsContainer>
                {nomenclatureGoods.map(
                  ({ id, title, icon, coefficient, postfix }) => {
                    return (
                      <StyledItemContent
                        key={id}
                        isSelected={selectedId === id}
                        onClick={() => setSelectedId(id)}
                      >
                        <StyledRow gap="16px">
                          <img src={icon} width="38px" height="38px" />
                          <StyledColumn>
                            <Typography>{title}</Typography>
                            <Typography variant="caption" color="#ABABAB">
                              {id}
                            </Typography>
                          </StyledColumn>
                        </StyledRow>
                        <Typography>
                          {Math.round(amount * coefficient)} {postfix}
                        </Typography>
                      </StyledItemContent>
                    )
                  },
                )}
              </StyledGoodsContainer>
              <StyledButton
                disabled={
                  amount <= 0 ||
                  tokenBalances['ТТР'] <= amount ||
                  operationStatus === 'sending'
                }
                onClick={() => {
                  redeemToken('ТТР', amount, selectedId)
                }}
              >
                Оплатить поставки
              </StyledButton>
            </StyledDrawerContent>
          </CustomTabPanel>
        </StyledDrawerContainer>
      </Drawer>
      <Tooltip title="Погашение товарного токена">
        <StyledOilBarrelOutlinedIcon onClick={handleOpen} />
      </Tooltip>
    </>
  )
}

const StyledOilBarrelOutlinedIcon = styled(OilBarrelOutlinedIcon)`
  color: #394e5d;
`
const StyledRow = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ gap }) => gap && `gap: ${gap}`};
`

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledGoodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StyledItemContent = styled.div<{ isSelected?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 15px;
  background: #ebf8ff;
  color: black;
  width: fit-content;
  height: fit-content;
  border-radius: 12px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  ${({ isSelected }) => isSelected && 'outline: 1.5px solid #1976d2'}
`
