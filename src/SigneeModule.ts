/**
 * 추가된 메서드 by SIGNEE
 */
import WalletConnect from "@walletconnect/browser";
import EthCrypto from 'eth-crypto';

let connector: WalletConnect;

interface IPayloadData {
    method: string;
    params: {
        address?: string,
        signature?: string,
        verifyResult?: boolean
    };
}

export const handleCallRequest = async (walletConnector: WalletConnect, payload: IPayloadData) => {
    connector = walletConnector;

    if (payload.method === 'check_user_info') {
        const result = await checkUserInfo(payload.params);
        returnUserInfoCheckResult(result);
    }
};

async function checkUserInfo(params: IPayloadData['params']) {
    console.log('requested method / check_user_info');  // tslint:disable-line

    try {
        const signer = await EthCrypto.recover(
            params.signature || '',
            EthCrypto.hash.keccak256(params.address || ''),
        );
        return signer === params.address;
    } catch (e) {
        return false;
    }
};

function returnUserInfoCheckResult(result: boolean) {
    console.log('request method / confirm_user_info '); // tslint:disable-line  

    sendCustomRequest('confirm_user_info', {
        verifyResult: result
    })
}

async function sendCustomRequest(method: string, params: IPayloadData['params']) {    
    await connector.sendCustomRequest({method,
        params: [params] || undefined,
    });
};
