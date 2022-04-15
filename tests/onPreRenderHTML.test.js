import { onPreRenderHTML } from '../src/gatsby-ssr';

const replaceHeadComponents = jest.fn();
const replacePreBodyComponents = jest.fn();
const replacePostBodyComponents = jest.fn();

const mockParams =
    ({ excludedPaths } = {}) =>
    ({ pathname }) => {
        const gatsbyHelper = {
            getHeadComponents: () => [],
            replaceHeadComponents,
            getPreBodyComponents: () => [],
            replacePreBodyComponents,
            getPostBodyComponents: () => [],
            replacePostBodyComponents,
            pathname,
        };
        const option = {
            analytics: true,
            canonicalBaseUrl: 'https://foo.com/',
            components: [],
            includedPaths: [],
            excludedPaths,
        };

        return [gatsbyHelper, option];
    };

describe('onPreRenderHTML - replaceHeadComponents', () => {
    beforeEach(() => {
        replaceHeadComponents.mockReset();
        replacePreBodyComponents.mockReset();
        replacePostBodyComponents.mockReset();
    });

    it('when is amp, should append some amp script tag', () => {
        onPreRenderHTML(
            ...mockParams()({
                pathname: '/amp/',
            })
        );
        expect(replaceHeadComponents.mock.calls).toMatchSnapshot();
    });

    describe('when is not amp & set excludePath to ["/foo/**"]', () => {
        const mockOption = mockParams({
            excludedPaths: ['/foo/**'],
        });

        it('when pathname is `/foo/bar`, should not call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/foo/bar',
                })
            );
            expect(replaceHeadComponents).not.toBeCalled();
        });

        it('when pathname is `/baz/foo/bar`, should call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/baz/foo/bar',
                })
            );
            expect(replaceHeadComponents).toBeCalled();
        });

        it('when pathname is `/baz/bar`, should call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/baz/bar',
                })
            );
            expect(replaceHeadComponents.mock.calls).toMatchSnapshot();
        });
    });

    describe('when is not amp & set excludePath to ["**/foo/**"]', () => {
        const mockOption = mockParams({
            excludedPaths: ['**/foo/**'],
        });

        it('when pathname is `/foo/bar`, should not call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/foo/bar',
                })
            );
            expect(replaceHeadComponents).not.toBeCalled();
        });

        it('when pathname is `/baz/foo/bar`, should not call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/baz/foo/bar',
                })
            );
            expect(replaceHeadComponents).not.toBeCalled();
        });

        it('when pathname is `/baz/bar`, should call replaceHeadComponents', () => {
            onPreRenderHTML(
                ...mockOption({
                    pathname: '/baz/bar',
                })
            );
            expect(replaceHeadComponents).toBeCalled();
        });
    });
});
