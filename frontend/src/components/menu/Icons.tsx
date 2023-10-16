import styled from '@emotion/styled'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ListAltIcon from '@mui/icons-material/ListAlt'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import SearchIcon from '@mui/icons-material/Search'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import { Drawer, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import FsLightbox from 'fslightbox-react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import noImg from '../../assets/noImg.png'
import pageOne from '../../assets/page1.jpg'
import pageTwo from '../../assets/page2.jpg'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useStore } from '../../stores/rootStore'
import {
  CustomTabPanel,
  StyledCloseIcon,
  StyledDrawerContainer,
  StyledHr,
  StyledText,
} from '../balance/Balances'

export const Icons = observer(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [orderIds, setOrderIds] = useState<string[]>([])
  const [tab, setTab] = useState(0)
  const { userStore } = useStore()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const isTablet = useMediaQuery('(max-width: 768px)')

  const {
    buyInvoices,
    sellInvoices,
    transferToken,
    tokenBalances,
    operationStatus,
    selectedProduct,
    selectProduct,
    clearSelectedProduct,
  } = userStore

  const handleOpen = () => {
    setOpen(true)
  }
  const handleModalClose = () => {
    setOpen(false)
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    clearSelectedProduct()
  }

  const buyPrice = orderIds.reduce((acc, orderId) => {
    const order = buyInvoices.find(({ id }) => id === orderId)
    if (order) {
      return acc + order.price
    } else return acc
  }, 0)

  const handleExpand = (event: any, data: any) => {
    event.stopPropagation()
    selectProduct(data)
  }

  const handleClose = () => {
    setIsOpen(false)
    clearSelectedProduct()
  }
  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <StyledDrawerContainer isTablet={isTablet}>
          <StyledCloseIcon onClick={handleClose} />
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Заявки на оплату" />
            <Tab label="Заявки на продажу" />
          </Tabs>
          <CustomTabPanel value={tab} index={0}>
            {selectedProduct ? (
              <StyledProductContent>
                <StyledContentColumn>
                  <StyledText isHighlight>{selectedProduct.product}</StyledText>
                  <img src={noImg} height="180px" width="180px" />

                  <StyledContentBlock>
                    <Typography>
                      Описание: {selectedProduct.description}
                    </Typography>
                    <Typography>
                      Количество: {selectedProduct.count} шт.
                    </Typography>
                    <Typography>Цена: {selectedProduct.price}</Typography>
                    <Typography>ГОТП: Китай</Typography>
                    <Typography>Продавец: {selectedProduct.wallet}</Typography>
                  </StyledContentBlock>
                  <StyledButton
                    onClick={() => {
                      clearSelectedProduct()
                    }}
                  >
                    Назад
                  </StyledButton>
                </StyledContentColumn>
              </StyledProductContent>
            ) : (
              <>
                <StyledDrawerContent>
                  <StyledListContainer>
                    {buyInvoices.map(
                      (
                        {
                          id,
                          product,
                          description,
                          dateFrom,
                          dateTo,
                          count,
                          price,
                          currency,
                          wallet,
                        },
                        index,
                      ) => {
                        const isSelected = orderIds.includes(id)
                        return (
                          <StyledContent
                            key={id}
                            isSelected={isSelected}
                            onClick={() => {
                              setOrderIds(ids =>
                                !isSelected
                                  ? [...ids, id]
                                  : ids.filter(orderId => orderId !== id),
                              )
                            }}
                          >
                            <StyledBlock>
                              <Typography>#{index + 1}</Typography>
                              <div>
                                <StyledText isHighlight>{product}</StyledText>
                                <Typography>
                                  {`${count}шт. ${description}`}
                                </Typography>
                              </div>
                            </StyledBlock>
                            <StyledBlock>
                              <Typography>
                                {price} {currency}
                              </Typography>
                              <AccountBalanceWalletIcon />
                              <StyledOpenInNewIcon
                                onClick={e => {
                                  console.log('clocked')
                                  handleExpand(e, {
                                    id,
                                    product,
                                    description,
                                    dateFrom,
                                    dateTo,
                                    count,
                                    price,
                                    currency,
                                    wallet,
                                  })
                                }}
                              />
                            </StyledBlock>
                          </StyledContent>
                        )
                      },
                    )}
                  </StyledListContainer>

                  <StyledHr />

                  <StyledButton
                    disabled={
                      buyPrice === 0 ||
                      buyPrice > tokenBalances['ТТР'] ||
                      operationStatus === 'sending'
                    }
                    onClick={() => {
                      transferToken('ТТР', buyPrice, orderIds)
                    }}
                  >
                    Оплатить поставки
                  </StyledButton>
                </StyledDrawerContent>
              </>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={tab} index={1}>
            {selectedProduct ? (
              <StyledProductContent>
                <StyledContentColumn>
                  <StyledText isHighlight>{selectedProduct.product}</StyledText>
                  <img src={noImg} height="180px" width="180px" />

                  <StyledContentBlock>
                    <Typography>
                      Описание: {selectedProduct.description}
                    </Typography>
                    <Typography>
                      Количество: {selectedProduct.count} шт.
                    </Typography>
                    <Typography>Цена: {selectedProduct.price}</Typography>
                    <Typography>ГОТП: Россия</Typography>
                    <Typography>Продавец: {selectedProduct.wallet}</Typography>
                  </StyledContentBlock>
                  <StyledButton
                    onClick={() => {
                      clearSelectedProduct()
                    }}
                  >
                    Назад
                  </StyledButton>
                </StyledContentColumn>
              </StyledProductContent>
            ) : (
              <StyledDrawerContent>
                <StyledListContainer>
                  {sellInvoices.map(
                    (
                      {
                        id,
                        product,
                        description,
                        dateFrom,
                        dateTo,
                        count,
                        price,
                        currency,
                        wallet,
                      },
                      index,
                    ) => {
                      return (
                        <StyledContent key={id}>
                          <StyledBlock>
                            <Typography>#{index + 1}</Typography>
                            <div>
                              <StyledText isHighlight>{product}</StyledText>
                              <Typography>
                                {`${count}шт. ${description}`}
                              </Typography>
                            </div>
                          </StyledBlock>
                          <StyledBlock>
                            <Typography>
                              {price} {currency}
                            </Typography>
                            <AccountBalanceWalletIcon />
                            <StyledOpenInNewIcon
                              onClick={e => {
                                console.log('clocked')
                                handleExpand(e, {
                                  id,
                                  product,
                                  description,
                                  dateFrom,
                                  dateTo,
                                  count,
                                  price,
                                  currency,
                                  wallet,
                                })
                              }}
                            />
                          </StyledBlock>
                        </StyledContent>
                      )
                    },
                  )}
                </StyledListContainer>
              </StyledDrawerContent>
            )}
          </CustomTabPanel>
        </StyledDrawerContainer>
      </Drawer>
      <FsLightbox
        toggler={open}
        sources={[<img src={pageOne} />, <img src={pageTwo} />]}
        key={page}
      />
      <Tooltip title="Заказы">
        <StyledListAltIcon onClick={() => setIsOpen(value => !value)} />
      </Tooltip>
      <Tooltip title="Мониторинг">
        <StyledSignalCellularAltIcon
          onClick={() => {
            window
              ?.open(
                'http://51.250.29.186:3000/d/a1lVy7ycin9Yv/goquorum-overview?orgId=1',
                '_blank',
              )
              .focus()
          }}
        />
      </Tooltip>
      <Tooltip title="Обозреватель блоков">
        <StyledSearchIcon
          onClick={() => {
            window?.open('http://51.250.29.186:25000/', '_blank').focus()
          }}
        />
      </Tooltip>

      <Tooltip title="Архитектура системы">
        <StyledQuestionMarkIcon onClick={() => setOpen(!open)} />
      </Tooltip>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18 17.8165C18.8811 16.9625 19.5553 15.929 19.9736 14.7911C20.3919 13.6532 20.5438 12.4394 20.4184 11.2375C20.293 10.0356 19.8934 8.87588 19.2485 7.84225C18.6037 6.80863 17.7297 5.92703 16.69 5.26135C15.3871 4.38969 13.8503 3.90526 12.2678 3.86738C10.6853 3.8295 9.12568 4.2398 7.77998 5.04806C6.81419 5.60729 5.97393 6.34868 5.30895 7.22836C4.64397 8.10805 4.16778 9.10813 3.90856 10.1694C3.64935 11.2307 3.61239 12.3316 3.79986 13.407C3.98733 14.4824 4.39542 15.5104 4.99998 16.4301L4.13998 18.4952C4.06724 18.6714 4.04944 18.8644 4.08877 19.0503C4.12811 19.2362 4.22285 19.4068 4.36127 19.541C4.49968 19.6752 4.67567 19.7671 4.86742 19.8052C5.05918 19.8433 5.25826 19.8261 5.43998 19.7556L7.55998 18.9024C9.16855 19.8982 11.0789 20.3332 12.9765 20.1358C14.8742 19.9384 16.6459 19.1204 18 17.8165V17.8165Z"
          stroke="#A5B4CB"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  )
})

const StyledQuestionMarkIcon = styled(QuestionMarkIcon)`
  color: #394e5d;
`
const StyledSearchIcon = styled(SearchIcon)`
  color: #394e5d;
`
const StyledListAltIcon = styled(ListAltIcon)`
  color: #394e5d;
`
const StyledSignalCellularAltIcon = styled(SignalCellularAltIcon)`
  color: #394e5d;
`

const StyledContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  z-index: 9;
`

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StyledContentColumn = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

export const StyledButton = styled.div<{ disabled?: boolean }>`
  width: 100%;
  height: 46px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  ${({ disabled }) =>
    disabled
      ? 'opacity: 0.5;  cursor: not-allowed; pointer-events: none;'
      : 'opacity: 1;  cursor: pointer;'};
`

const StyledDrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`

const StyledContent = styled.div<{ isSelected?: boolean }>`
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
const StyledBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`

const StyledProductContent = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 40px;
`
