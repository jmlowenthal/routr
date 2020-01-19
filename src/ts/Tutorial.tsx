import React from 'react';

export default () => {
    return (
        <div>
            <div className="Tutorial-header">
                <h1>Routr</h1>
            </div>
            <div className="Tutorial-contents">
                <ul className="Tutorial-key">
                    <li><img src="/node.png" alt="A white node"/> A node communicates with other nodes on the network by sending packets.</li>
                    <li><img src="/infected-node.png" alt="A red node"/> Infected nodes try to spread the infection to other nodes by sending malicious packets.</li>
                    <li><img src="/avast-logo.png" alt="Avast logo"/> The avast antivirus node can disinfect the infected nodes.</li>
                    <li><img src="/firewall.png" alt="Firewall link"/> Links connect nodes together, and have a limited capacity. A firewall can be added to filter out malicious packets.</li>
                </ul>

                <p>The aim of the game is to keep the network running for as long as possible, without having too many packets queued at each node and without letting the infection get out of control.</p>
            </div>
        </div>
    )
}