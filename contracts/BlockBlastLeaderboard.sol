// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BlockBlastLeaderboard
/// @notice Simple on-chain leaderboard: tracks each address' best score and maintains Top N.
contract BlockBlastLeaderboard {
    uint256 public constant MAX_ENTRIES = 25;

    struct Entry {
        address player;
        uint256 score;
    }

    /// @notice Best score per player (monotonic increasing).
    mapping(address => uint256) public bestScore;
    /// @notice Top leaderboard sorted desc by score.
    Entry[] private leaderboard;
    /// @dev Player index in leaderboard array + 1 (0 means not present).
    mapping(address => uint256) private indexPlusOne;

    event ScoreSubmitted(address indexed player, uint256 score);

    function submitScore(uint256 score) external {
        require(score > 0, "Score must be > 0");
        require(score > bestScore[msg.sender], "Not a new best");

        bestScore[msg.sender] = score;
        emit ScoreSubmitted(msg.sender, score);

        uint256 idx1 = indexPlusOne[msg.sender];
        if (idx1 > 0) {
            // Update existing entry and bubble up.
            uint256 i = idx1 - 1;
            leaderboard[i].score = score;
            _bubbleUp(i);
            return;
        }

        if (leaderboard.length < MAX_ENTRIES) {
            leaderboard.push(Entry({player: msg.sender, score: score}));
            indexPlusOne[msg.sender] = leaderboard.length; // new index + 1
            _bubbleUp(leaderboard.length - 1);
            return;
        }

        // Full: replace last if better than last score.
        uint256 last = leaderboard.length - 1;
        if (score <= leaderboard[last].score) {
            return;
        }

        // Remove old mapping for the replaced player.
        indexPlusOne[leaderboard[last].player] = 0;
        leaderboard[last] = Entry({player: msg.sender, score: score});
        indexPlusOne[msg.sender] = last + 1;
        _bubbleUp(last);
    }

    function getLeaderboard()
        external
        view
        returns (address[] memory players, uint256[] memory scores)
    {
        uint256 n = leaderboard.length;
        players = new address[](n);
        scores = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            Entry memory e = leaderboard[i];
            players[i] = e.player;
            scores[i] = e.score;
        }
    }

    function leaderboardLength() external view returns (uint256) {
        return leaderboard.length;
    }

    function _bubbleUp(uint256 i) internal {
        // Insertion-sort style: move upwards while score is higher than previous.
        while (i > 0) {
            uint256 prev = i - 1;
            if (leaderboard[i].score <= leaderboard[prev].score) break;

            Entry memory tmp = leaderboard[prev];
            leaderboard[prev] = leaderboard[i];
            leaderboard[i] = tmp;

            indexPlusOne[leaderboard[i].player] = i + 1;
            indexPlusOne[leaderboard[prev].player] = prev + 1;
            i = prev;
        }
    }

    // Optional: allow ties to keep deterministic ordering (stable-ish).
}

