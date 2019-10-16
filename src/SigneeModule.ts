/**
 * 추가된 메서드 by SIGNEE
 */
import WalletConnect from "@walletconnect/browser";
import EthCrypto from 'eth-crypto';

let connector: WalletConnect;

const identity = EthCrypto.createIdentity();

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
        returnUserInfoCheckResult(result, payload);
        return result;
    }
    
    return false;
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

function requestRegisterDapp() {
    console.log('send custom method : register_dapp '); // tslint:disable-line  
    console.log(identity); // tslint:disable-line  

    sendCustomRequest('register_dapp', {
        address: identity.publicKey
    })
};

function returnUserInfoCheckResult(result: boolean, payload: object) {
    console.log('send custom request : confirm_user_info '); // tslint:disable-line  

    sendCustomRequest('confirm_user_info', {
        verifyResult: result
    })

    if (result) {
        requestRegisterDapp();
    }
}

async function sendCustomRequest(method: string, params: IPayloadData['params']) {    
    await connector.sendCustomRequest({method,
        params: [params] || undefined,
    });
};
