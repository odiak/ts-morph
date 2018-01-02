﻿import {TextManipulator} from "./TextManipulator";
import {Node} from "./../../compiler";
import {getPreviousMatchingPos, getNextMatchingPos} from "./../textSeek";

export interface RemoveChildrenTextManipulatorOptions {
    children: Node[];
    removePrecedingSpaces?: boolean;
    removeFollowingSpaces?: boolean;
    removePrecedingNewLines?: boolean;
    removeFollowingNewLines?: boolean;
}

export class RemoveChildrenTextManipulator<TNode extends Node> implements TextManipulator {
    constructor(private readonly opts: RemoveChildrenTextManipulatorOptions) {
    }

    getNewText(inputText: string) {
        const {children, removePrecedingSpaces = false, removeFollowingSpaces = false, removePrecedingNewLines = false, removeFollowingNewLines = false} = this.opts;
        const sourceFile = children[0].getSourceFile();
        const fullText = sourceFile.getFullText();

        return getPrefix() + getSuffix();

        function getPrefix() {
            return fullText.substring(0, getRemovalPos());
        }

        function getSuffix() {
            return fullText.substring(getRemovalEnd());
        }

        function getRemovalPos() {
            const pos = children[0].getNonWhitespaceStart();
            if (removePrecedingSpaces || removePrecedingNewLines)
                return getPreviousMatchingPos(fullText, pos, getCharRemovalFunction(removePrecedingSpaces, removePrecedingNewLines));
            return pos;
        }

        function getRemovalEnd() {
            const end = children[children.length - 1].getEnd();
            if (removeFollowingSpaces || removeFollowingNewLines)
                return getNextMatchingPos(fullText, end, getCharRemovalFunction(removeFollowingSpaces, removeFollowingNewLines));
            return end;
        }

        function getCharRemovalFunction(removeSpaces: boolean, removeNewLines: boolean) {
            return (char: string) => {
                if (removeNewLines && (char === "\r" || char === "\n"))
                    return false;
                if (removeSpaces && !charNotSpaceOrTab(char))
                    return false;
                return true;
            };
        }

        function charNotSpaceOrTab(char: string) {
            return char !== " " && char !== "\t";
        }
    }

    getTextForError(newText: string) {
        return newText;
    }
}