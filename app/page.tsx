'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [contractAddress, setContractAddress] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          const chain = await window.ethereum.request({ method: 'eth_chainId' })
          setChainId(chain)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        setIsConnected(true)
        const chain = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(chain)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Ошибка подключения кошелька')
      }
    } else {
      alert('MetaMask не установлен!')
    }
  }

  const switchToBaseSepolia = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14a34' }], // Base Sepolia Testnet
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x14a34',
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia-explorer.base.org'],
                },
              ],
            })
          } catch (addError) {
            console.error('Error adding chain:', addError)
          }
        }
      }
    }
  }

  return (
    <div className="container">
      <h1>🚀 BlockBlast</h1>
      <p className="subtitle">Смарт-контракт для Base Dev</p>

      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '✅ Кошелек подключен' : '❌ Кошелек не подключен'}
      </div>

      {!isConnected ? (
        <button className="button" onClick={connectWallet}>
          Подключить кошелек
        </button>
      ) : (
        <>
          <div className="info">
            <div className="info-item">
              <span className="info-label">Адрес:</span>
              <span className="info-value">{account}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Chain ID:</span>
              <span className="info-value">{chainId}</span>
            </div>
            {contractAddress && (
              <div className="info-item">
                <span className="info-label">Контракт:</span>
                <span className="info-value">{contractAddress}</span>
              </div>
            )}
          </div>

          <button className="button" onClick={switchToBaseSepolia}>
            Переключиться на Base Sepolia
          </button>
        </>
      )}

      <div className="info" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Инструкции:</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Подключите кошелек MetaMask</li>
          <li>Переключитесь на Base Sepolia Testnet</li>
          <li>Задеплойте контракт через Remix или Hardhat</li>
          <li>Используйте адрес контракта для подачи заявки в Base Dev</li>
        </ol>
      </div>
    </div>
  )
}
